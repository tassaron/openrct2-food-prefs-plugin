/**
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
/**
 ** Bucket of functions about dealing with guests and the guestdb
 */
import { arrayIncludes, createFavouriteFood, getAvailableFood } from "./util";
import { GuestDb, GuestFoodArray, GuestFoodItemType, tileSize } from "./globals";
import { Logger } from "./logger";

const log = new Logger("guests", 2);

export function createGuestDb() {
    const db: GuestDb = {};
    const loaded: GuestDb = {};
    let numLoaded = 0;
    const parkStorage = context.getParkStorage("food-prefs");
    if (parkStorage.has("guests")) {
        Object.assign(loaded, parkStorage.getAll("guests"));
        numLoaded = Object.keys(loaded).length;
        Object.assign(db, loaded);
    }
    parkStorage.set<GuestDb>("guests", db);
    log.info(`Loaded ${numLoaded} guests from parkstorage`);
    return db;
}

export function scheduledCleanup(db: GuestDb) {
    const rubbish: number[] = [];
    for (const id of Object.getOwnPropertyNames(db).map(Number)) {
        const guest = map.getEntity(id);
        if (!isValidGuest(guest)) {
            // remember invalid entries to be cleaned up later
            log.debug(`${id} is invalid. removing later`);
            rubbish.push(id);
            continue;
        }
    }
    // cleanup outdated entries
    if (rubbish.length < 1) return;
    log.info(`deleting invalid IDs found in db (${rubbish})`);
    for (const id of rubbish) {
        delete db[id];
    }
}

export function isValidGuest(guest: Entity) {
    return !(guest === null || guest.id === null || !(guest as Guest).items);
}

export function setGuestDestination(guest: Guest, coords: CoordsXY) {
    guest.destination = coords;
}

export function setGuestDirection(guest: Guest, direction: Direction) {
    guest.direction = direction;
}

export function getGuestsOnNeighbouringTile(origin: CoordsXYZD) {
    /*
     ** 0 is the direction facing map edge spanning ((1, maxY), (1, 1))
     ** 1 is the direction facing map edge spanning ((maxX, maxY), (1, maxY))
     ** 2 is the direction facing map edge spanning ((maxX, maxY), (maxX, 1))
     ** 3 is the direction facing map edge spanning ((1, 1), (maxX, 1))
     **
     ** this origin is by pixel so when moving positively we must add `tileSize`
     */

    let lgbt;
    switch (origin.direction) {
        case 0:
            // #TODO filter for z coord??
            lgbt = map.getAllEntitiesOnTile("guest", map.getTile(origin.x - 1, origin.y));
            break;
        case 1:
            lgbt = map.getAllEntitiesOnTile("guest", map.getTile(origin.x, origin.y + tileSize + 1));
            break;
        case 2:
            lgbt = map.getAllEntitiesOnTile("guest", map.getTile(origin.x + tileSize + 1, origin.y));
            break;
        case 3:
            lgbt = map.getAllEntitiesOnTile("guest", map.getTile(origin.x, origin.y - 1));
            break;
        default:
            return [];
    }
    return lgbt.filter((entity) => {
        return isValidGuest(entity);
    });
}

export function checkGuestForVoucher(guestEntity: Guest): GuestFoodItemType | false {
    if (guestEntity.items.length == 0) return false;
    const potentialVoucher = (guestEntity as Guest).items[0];
    if (potentialVoucher.type === "voucher" && (potentialVoucher as Voucher).voucherType === "food_drink_free") {
        return (potentialVoucher as FoodDrinkVoucher).item as GuestFoodItemType;
    }
    return false;
}

export function getFoodPrefStats(db: GuestDb) {
    const stats = GuestFoodArray.reduce((obj, key: GuestFoodItemType) => ({ ...obj, [key]: 0 }), {}) as Record<
        GuestFoodItemType,
        number
    >;
    const keys = Object.keys(db);
    for (let key of keys.map(Number)) {
        stats[db[key]]++;
    }
    for (const food of GuestFoodArray) {
        if (stats[food] < 1) continue;
        stats[food] = Math.round((stats[food] / keys.length) * 100);
    }
    return stats;
}

export function addMissingFoodPrefs(db: GuestDb, guests: Guest[]) {
    const foodAvailable = getAvailableFood("scenario");
    const keys = Object.keys(db).map(Number);
    for (let guest of guests) {
        if (arrayIncludes(keys, guest.id)) continue;
        const voucher = checkGuestForVoucher(guest);
        const favouriteGender = voucher ? voucher : createFavouriteFood(foodAvailable);
        db[guest.id!] = favouriteGender;
        log.verbose(`${guest.name} (${guest.id}) assigned ${favouriteGender}${voucher ? " due to a voucher" : ""}`);
    }
}
