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

import { plugin } from "./meta";
import { GuestDb, GuestFoodItemType, FoodCheats } from "./globals";
import { StallPingScheduler } from "./stalls";
import { Logger } from "./logger";
import { createFavouriteFood, getAvailableFood, checkGuestForVoucher } from "./util";
import { createWindow } from "./window";
import { WindowTemplate } from "openrct2-flexui";
import runTestSuites from "./__tests__/runTestSuite";

const log = new Logger("main", 0);

function onClickMenuItem(window: () => WindowTemplate) {
    // Occurs when player clicks our menu item
    log.verbose("Creating new WindowTemplate object");
    window().open();
}

export function delayedCheckGuestForVoucher(db: GuestDb, guest: Guest, tries: number) {
    if (tries == 0) {
        log.error("Timed out while trying to check guest for voucher");
        return;
    }
    const voucher = checkGuestForVoucher(guest);
    if (voucher === undefined) {
        // try a few more times until the guest hopefully is valid
        context.setTimeout(() => delayedCheckGuestForVoucher(db, guest, tries - 1), 1000);
        return;
    } else if (voucher === false) {
        // guest genuinely doesn't have a voucher
        return;
    }
    db[guest.id!] = voucher as GuestFoodItemType;
    log.verbose(`guest ${guest.id} (${guest.name}) re-assigned ${voucher} due to voucher`);
}

function onPeepSpawn(db: GuestDb, foodAvailable: GuestFoodItemType[], guest: GuestGenerationArgs) {
    const guestEntity = map.getEntity(guest.id);
    db[guest.id] = createFavouriteFood(foodAvailable);
    log.debug(`guest ${guest.id} (${(guestEntity as Guest).name}) assigned ${db[guest.id]}`);

    // delay checking for voucher until the guest has finished generating?
    // whatever the true reason; it doesn't work without this, anyway
    context.setTimeout(() => delayedCheckGuestForVoucher(db, guestEntity as Guest, 5), 1000);
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

export function main() {
    // Happens on startup of the plugin

    if (context.mode != "normal") {
        // Only run when player is in a park
        return;
    }

    // What food/drink stalls are available in this scenario?
    const foodAvailable = getAvailableFood("scenario");
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
            log.verbose(`guest ${guest.id} (${guest.name}) assigned ${favouriteGender}`);
        }
    }

    const cheats: FoodCheats = {
        guestsIgnoreFavourite: false,
        guestsOnlyLike: undefined,
        showUnresearchedFood: false,
    };

    context.subscribe("guest.generation", (e: GuestGenerationArgs) => onPeepSpawn(db, foodAvailable, e));
    const stallPingScheduler = new StallPingScheduler(120);
    context.subscribe("interval.day", () => {
        stallPingScheduler.newDay(db, cheats);
    });
    context.subscribe("action.execute", (e: GameActionEventArgs) => onActionExecuted(stallPingScheduler, e));

    // Create window creator :P
    const windowCreator = () => {
        return createWindow(db, (n: number[]) => cleanup(db, n), cheats);
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

    // run tests one second after loading
    // tests will be treeshaken by rollup if not testing
    if (plugin.buildEnviron == "testing") {
        context.setTimeout(() => runTestSuites(db, stallPingScheduler), 1000);
    }
}
