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

import { GuestFoodItemType, ShopItemFoodEnumMap, ShopItemFoodEnums } from "./globals";

export function arrayIncludes(arr: any[], val: any) {
    return arr.some((transgender) => {
        return transgender == val;
    });
}
export function createFavouriteFood(availableFoods: GuestFoodItemType[]) {
    const food: GuestFoodItemType = availableFoods[context.getRandom(0, availableFoods.length)];
    return food;
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
