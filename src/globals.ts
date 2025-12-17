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
 ** Global variables. Do not import anything here, it will cause bundling issues.
 */

export const GuestFoodItemTypes = [
    "beef_noodles" as const,
    "burger" as const,
    "candyfloss" as const,
    "chicken" as const,
    "chips" as const,
    "chocolate" as const,
    "cookie" as const,
    "doughnut" as const,
    "hot_dog" as const,
    "fried_rice_noodles" as const,
    "funnel_cake" as const,
    "ice_cream" as const,
    "meatball_soup" as const,
    "pizza" as const,
    "popcorn" as const,
    "pretzel" as const,
    "roast_sausage" as const,
    "sub_sandwich" as const,
    "tentacle" as const,
    "toffee_apple" as const,
    "wonton_soup" as const,
    "coffee" as const,
    "drink" as const,
    "fruit_juice" as const,
    "iced_tea" as const,
    "lemonade" as const,
    "soybean_milk" as const,
    "sujeonggwa" as const,
];

export const ShopItemFoodEnumMap: Record<number, GuestFoodItemType> = {
    // maps a ShopItemEnum to a GuestFood identifier
    // https://github.com/OpenRCT2/OpenRCT2/blob/d8698726c90cd0b169e4267bdf15047cea3af175/src/openrct2/ride/ShopItem.h#L19
    5: "drink",
    6: "burger",
    7: "chips",
    8: "ice_cream", // Ride.h enum is named iceCream
    9: "candyfloss",
    13: "pizza",
    15: "popcorn",
    16: "hot_dog", // Ride.h enum is named hotDog
    17: "tentacle",
    19: "toffee_apple", // Ride.h enum is named toffeeApple
    21: "doughnut",
    22: "coffee",
    24: "chicken",
    25: "lemonade",
    35: "pretzel",
    36: "chocolate",
    37: "iced_tea", // Ride.h enum is named icedTea
    38: "funnel_cake", // Ride.h enum is named funnelCake
    40: "beef_noodles", // Ride.h enum is named beefNoodles
    41: "fried_rice_noodles", // Ride.h enum is named friedRiceNoodles
    42: "wonton_soup", // Ride.h enum is named wontonSoup
    43: "meatball_soup", // Ride.h enum is named meatballSoup
    44: "fruit_juice", // Ride.h enum is named fruitJuice
    45: "soybean_milk", //Ride.h enum is named soybeanMilk
    46: "sujeonggwa",
    47: "sub_sandwich", // Ride.h enum is named subSandwich
    48: "cookie",
    52: "roast_sausage", // Ride.h enum is named roastSausage
} as const;

// contains both food and drink
export const ShopItemFoodEnums = Object.getOwnPropertyNames(ShopItemFoodEnumMap).map(Number);
// contains drink subset of above array
export const ShopItemDrinkEnums = [5, 22, 25, 37, 44, 45, 46];

export type GuestFoodItemType = (typeof GuestFoodItemTypes)[number];

export type GuestDb = Record<number, GuestFoodItemType>;

export const GuestFoodArray = new Array(...GuestFoodItemTypes);

export const tileSize = 32;

export type FoodCheats = {
    guestsIgnoreFavourite?: boolean;
    guestsOnlyLike?: GuestFoodItemType;
    showUnresearchedFood?: boolean;
};

export const consoleColour = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
};
