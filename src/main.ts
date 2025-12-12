/*
 **    Copyright (C) 2025 Brianna Rainey
 **    This program is free software: you can redistribute it and/or modify
 **    it under the terms of the GNU General Public License as published by
 **    the Free Software Foundation, either version 3 of the License, or
 **    (at your option) any later version.
 **
 **    This program is distributed in the hope that it will be useful,
 **    but WITHOUT ANY WARRANTY; without even the implied warranty of
 **    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 **    GNU General Public License for more details.
 **
 **    You should have received a copy of the GNU General Public License
 **    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { GuestDb, ShopItemFoodEnums, ShopItemFoodEnumMap, GuestFoodItemType } from "./globals";
import { StallPingScheduler } from "./stalls";
import { Logger } from "./logger";
import { arrayIncludes, createFavouriteFood, isValidGuest } from "./util";
import { createWindow } from "./window";
import { WindowTemplate } from "openrct2-flexui";

const log = new Logger("main", 1);

function onClickMenuItem(window: () => WindowTemplate) {
    // Occurs when player clicks our menu item
    log.verbose("-~-~-~-~-~-~click~-~-~-~-~-~-~");
    window().open();
}

function onPeepSpawn(db: GuestDb, foodAvailable: GuestFoodItemType[], guest: GuestGenerationArgs) {
    const guestEntity = map.getEntity(guest.id);
    db[guest.id] = createFavouriteFood(foodAvailable);
    log.debug(`guest ${guest.id} (${(guestEntity as Guest).name}) assigned ${db[guest.id]}`);
    if (!isValidGuest) return;
    const checkGuestForVoucher = function () {
        if ((guestEntity as Guest).items.length != 1) return;
        const potentialVoucher = (guestEntity as Guest).items[0];
        if (potentialVoucher.type === "voucher" && (potentialVoucher as Voucher).voucherType === "food_drink_free") {
            db[guest.id] = (potentialVoucher as FoodDrinkVoucher).item as GuestFoodItemType;
            log.debug(`guest ${guest.id} (${(guestEntity as Guest).name}) re-assigned ${db[guest.id]} due to voucher`);
        }
    };
    // delay checking for voucher until the guest has finished generating?
    // whatever the true reason; it doesn't work without this, anyway
    context.setTimeout(checkGuestForVoucher, 1000);
}

function onActionExecuted(stallPingScheduler: StallPingScheduler, e: GameActionEventArgs) {
    if ((e.action == "ridedemolish" || e.action == "ridesetstatus") && !e.isClientOnly && !e.result.error) {
        stallPingScheduler.updateStalls();
    }
}

function cleanup(db: GuestDb, rubbish: number[]) {
    if (rubbish.length < 1) return;
    log.warn(`deleting invalid IDs found in db (${rubbish})`);
    for (const id of rubbish) {
        delete db[id];
    }
}

function getAvailableFood() {
    const foods: GuestFoodItemType[] = [];
    objectManager
        .getAllObjects("ride")
        .filter((obj) => obj.shopItem != 255)
        .forEach((rideObj) => {
            if (arrayIncludes(ShopItemFoodEnums, rideObj.shopItem)) {
                foods.push(ShopItemFoodEnumMap[rideObj.shopItem]);
            }
        });
    return foods;
}

export function main() {
    // Happens on startup of the plugin

    if (context.mode != "normal") {
        // Only run when player is in a park
        return;
    }

    // What food/drink stalls are available in this scenario?
    const foodAvailable = getAvailableFood();
    log.info(`found foods for scenario: ${foodAvailable}`);
    // Load/create GuestDb for this park
    //log.info("loading data for saved entities");
    //const parkStorage = context.getParkStorage();
    //const entityIds = parkStorage.getAll("tassaron.food-prefs.entity");
    const db: GuestDb = {};
    const currentGuests = map.getAllEntities("guest");
    for (const guest of currentGuests) {
        if (guest.id != null) {
            const favouriteGender = createFavouriteFood(foodAvailable);
            db[guest.id] = favouriteGender;
            log.debug(`guest ${guest.id} (${guest.name}) assigned ${favouriteGender}`);
        }
    }

    // register our custom action to synchronize guest movement
    //context.registerAction("guestsetdestination", querySetGuestDestination, executeSetGuestDestination);

    context.subscribe("guest.generation", (e: GuestGenerationArgs) => onPeepSpawn(db, foodAvailable, e));
    const stallPingScheduler = new StallPingScheduler(120);
    context.subscribe("interval.day", () => {
        stallPingScheduler.newDay(db);
    });
    context.subscribe("action.execute", (e: GameActionEventArgs) => onActionExecuted(stallPingScheduler, e));

    // Create window creator :P
    // I tried to use a proper model for this, but couldn't get the example code to run
    const windowCreator = () => {
        return createWindow(db, (n: number[]) => cleanup(db, n));
    };

    // Register a menu item under the map icon:
    if (typeof ui !== "undefined") {
        ui.registerShortcut({
            id: "food-prefs.openwindow",
            text: "Open Food Preferences window",
            bindings: ["CTRL+F"],
            callback: () => onClickMenuItem(windowCreator),
        });
        ui.registerMenuItem("Food Preferences", () => onClickMenuItem(windowCreator));
    }
}
