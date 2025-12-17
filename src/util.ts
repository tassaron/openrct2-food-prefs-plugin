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

/*
 ** FUNCTIONS! Do not import anything aside from globals; it will cause bundling issues.
 */

import { GuestDb, GuestFoodArray, GuestFoodItemType, ShopItemFoodEnumMap, ShopItemFoodEnums, tileSize } from "./globals";

export function createFavouriteFood(availableFoods: GuestFoodItemType[]) {
    const food: GuestFoodItemType = availableFoods[context.getRandom(0, availableFoods.length)];
    return food;
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

export function arrayIncludes(arr: any[], val: any) {
    return arr.some((transgender) => {
        return transgender == val;
    });
}

export function getAvailableFood(type: "researched" | "scenario") {
    const foods: GuestFoodItemType[] = [];
    objectManager
        .getAllObjects("ride")
        .filter((obj) => obj.shopItem != 255)
        .forEach((obj_) => {
            if (arrayIncludes(ShopItemFoodEnums, obj_.shopItem)) {
                if (type === "scenario" || (type === "researched" && park.research.isObjectResearched("ride", obj_.index))) {
                    foods.push(ShopItemFoodEnumMap[obj_.shopItem]);
                }
            }
        });
    return foods;
}

export function checkGuestForVoucher(guestEntity: Guest): GuestFoodItemType | undefined | false {
    if (!isValidGuest(guestEntity) || (guestEntity as Guest).items.length != 1) return undefined;
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
