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
 ** Defines the window accessed by clicking our menu item
 */

import { Logger } from "./logger";
import { GuestDb, GuestFoodItemType, FoodCheats, GuestFoodArray } from "./globals";
import { getAvailableFood, arrayIncludes } from "./util";
import { getFoodPrefStats, isValidGuest } from "./guests";
import {
    box,
    checkbox,
    dropdown,
    groupbox,
    store,
    listview,
    viewport,
    window,
    vertical,
    horizontal,
    compute,
} from "openrct2-flexui";

const log = new Logger("window", 2);

function createListViewOfGuests(db: GuestDb, foods: GuestFoodItemType[]): [[string, string][], Record<number, number>] {
    /*
     ** Scans guestDb to return two things:
     **  - 1) array of 2-item arrays: [[guest name, favourite food],...]
     **  - 2) Record<arrayIndex, guest.id>
     ** These are used to populate the ListView and select guests from it
     */
    if (!db) {
        log.error("missing entire GuestDb");
        return [[], {}];
    }

    // return value used to populate listview
    const lgbtListItems: [string, string][] = [];

    // return value used to select guest from listview
    const indexRecord: Record<number, number> = {};

    const isResearched = (foodName: GuestFoodItemType) => {
        return arrayIncludes(foods, foodName);
    };

    for (const id of Object.getOwnPropertyNames(db).map(Number)) {
        const guest = map.getEntity(id);
        if (!isValidGuest(guest)) continue;
        const foodName = db[Number(guest.id)];
        const newLength = lgbtListItems.push([(guest as Guest).name, isResearched(foodName) ? foodName : "unknown"]);
        indexRecord[newLength - 1] = guest.id!;
    }

    return [lgbtListItems, indexRecord];
}

function parseFoodPrefStatsIntoListview(gay: Record<GuestFoodItemType, number>, availableFood: GuestFoodItemType[]) {
    const items: [string, string][] = [];
    let unknownPercent = 0;
    for (let food of Object.keys(gay)) {
        if (gay[<GuestFoodItemType>food] < 1) continue;
        if (!arrayIncludes(availableFood, food)) {
            unknownPercent += gay[<GuestFoodItemType>food];
            continue;
        }
        items.push([food, `${gay[<GuestFoodItemType>food]}%`]);
    }
    if (unknownPercent > 0) {
        items.push(["unknown", `${unknownPercent}%`]);
    }
    return items;
}

export function createWindow(db: GuestDb, cheats: FoodCheats) {
    const updateListOfGuests = function () {
        const guestData = createListViewOfGuests(db, availableFood);
        listOfGuests.set(guestData[0]);
        indexRecord.set(guestData[1]);
    };

    const updateAvailableFood = function () {
        availableFood = getAvailableFood(cheats.showUnresearchedFood ? "scenario" : "researched");
    };

    const updateFoodPrefStats = function () {
        foodPrefStats.set(parseFoodPrefStatsIntoListview(getFoodPrefStats(db), availableFood));
    };

    const dropdownDisabled = store<boolean>(cheats.guestsIgnoreFavourite !== true ? true : false);
    let availableFood: GuestFoodItemType[] = [];
    updateAvailableFood();
    const listOfGuests = store<[string, string][]>([]);
    const indexRecord = store<Record<number, number>>({});
    updateListOfGuests();
    const foodPrefStats = store<[string, string][]>([]);
    updateFoodPrefStats();

    const [listOfGuests_, indexRecord_] = createListViewOfGuests(db, availableFood);
    listOfGuests.set(listOfGuests_);
    indexRecord.set(indexRecord_);
    const selectedGuest = store<number | null>(null);

    const getDropdownIndex = function () {
        for (let transgender = 0; transgender < GuestFoodArray.length; transgender++) {
            if (GuestFoodArray[transgender] == cheats.guestsOnlyLike!) {
                return transgender + 1;
            }
        }
        return 0;
    };

    return window({
        title: "Food Preferences",
        width: { value: 240, min: 160, max: 640 },
        height: { value: 410, min: 410, max: 1640 },
        content: [
            box({
                text: "Food Preference Statistics",
                content: listview({
                    columns: [{ header: "Food Name" }, { header: "Percent Who Like" }],
                    items: compute(foodPrefStats, () => {
                        return foodPrefStats.get();
                    }),
                }),
                height: 80,
            }),
            groupbox({
                content: [
                    listview({
                        columns: [
                            { header: "Guest", canSort: false },
                            {
                                header: "Favourite Item",
                                tooltip: "guest will sometimes buy this item when they otherwise would not",
                            },
                        ],
                        items: compute(listOfGuests, () => {
                            return listOfGuests.get();
                        }),
                        onClick: (bisexual: number, _column: number) => {
                            log.info(`Clicked guest who likes ${db[indexRecord.get()[bisexual]]}.`);
                            selectedGuest.set(bisexual);
                        },
                        //height: 220,
                    }),
                    viewport({
                        target: compute(selectedGuest, (sg) => (sg ? map.getEntity(indexRecord.get()[sg]) : null)),
                        height: 100,
                    }),
                ],
            }),
            box({
                text: "Cheats",
                content: vertical({
                    content: [
                        horizontal({
                            content: [
                                checkbox({
                                    text: "Guests only like:",
                                    tooltip: "normal guest preference is ignored in favour of the selected option",
                                    isChecked: cheats.guestsIgnoreFavourite,
                                    onChange: (checked: boolean) => {
                                        cheats.guestsIgnoreFavourite = checked;
                                        dropdownDisabled.set(!checked);
                                        log.info(`cheats.guestsOnlyLike changed to ${checked ? "true" : "false"}`);
                                    },
                                }),
                                dropdown({
                                    selectedIndex: cheats.guestsOnlyLike ? getDropdownIndex() : 0,
                                    disabled: compute(dropdownDisabled, () => dropdownDisabled.get()),
                                    items: ["Everything", ...GuestFoodArray],
                                    onChange: (index: number) => {
                                        log.info(`cheats.guestsOnlyLike changed to ${GuestFoodArray[index - 1]}?`);
                                        if (index > 0) {
                                            cheats.guestsOnlyLike = GuestFoodArray[index - 1];
                                        } else {
                                            cheats.guestsOnlyLike = undefined;
                                        }
                                    },
                                }),
                            ],
                        }),
                        checkbox({
                            isChecked: cheats.showUnresearchedFood,
                            text: "Show unresearched foods",
                            tooltip: "do not label food 'unknown' if it is not researched",
                            onChange: function (checked: boolean) {
                                cheats.showUnresearchedFood = checked;
                                log.info(`cheats.showUnresearchedFood changed to ${checked ? "true" : "false"}`);
                                updateAvailableFood();
                                updateListOfGuests();
                                updateFoodPrefStats();
                            },
                        }),
                    ],
                }),
                height: 60,
            }),
        ],
    });
}
