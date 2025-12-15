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
import { GuestDb, GuestFoodItemType, ShopItemFoodEnumMap, tileSize } from "../globals";
import { StallPingScheduler } from "../stalls";
import { getGuestsOnNeighbouringTile } from "../util";
import runTest from "./runTest";

function test_SubSandwichStationTrackHasExpectedCoords() {
    const coords = map.rides[22].stations[0].start;
    console.log(`Expect ${Math.floor(coords.x / tileSize)} == 2 && ${Math.floor(coords.y / tileSize)} == 13`);
    return Math.floor(coords.x / tileSize) == 2 && Math.floor(coords.y / tileSize) == 13;
}

function test_MoonJuiceStationTrackHasExpectedCoords() {
    // facing a different direction from the above
    const coords = map.rides[30].stations[0].start;
    map.rides[30].name == "Moon Juice 1";
    console.log(`Expect ${Math.floor(coords.x / tileSize)} == 10 && ${Math.floor(coords.y / tileSize)} == 9`);
    return Math.floor(coords.x / tileSize) == 10 && Math.floor(coords.y / tileSize) == 9;
}

function test_MoonJuiceStallHasExpectedName() {
    const name = map.rides[30].name;
    console.log(`Expect "${name}" == "Moon Juice 1"`);
    return name == "Moon Juice 1";
}

function test_SubSandwichStallFoundBySPS(stallPingScheduler: StallPingScheduler) {
    const shopItem = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 22;
    })[0][0].object.shopItem;
    console.log(`Expect "${ShopItemFoodEnumMap[shopItem]}" == "sub_sandwich"`);
    return ShopItemFoodEnumMap[shopItem] == "sub_sandwich";
}

function test_GuestsPreferSoybeanMilk(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const nearbyGuests = getGuestsOnNeighbouringTile(coords);
    const guest = <number>nearbyGuests[0].id;
    const modifiedEntries: Record<number, GuestFoodItemType> = {};
    modifiedEntries[guest] = "soybean_milk";
    const customers = StallPingScheduler.findCustomers(Object.assign(db, modifiedEntries), ride, coords, {});
    console.log(`Expect ${Object.keys(customers).length} == 1`);
    return Object.keys(customers).length == 1;
}

function test_GuestsPreferEverythingWithCheats(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const customers = StallPingScheduler.findCustomers(db, ride, coords, { guestsIgnoreFavourite: true });
    console.log(`Expect ${Object.keys(customers).length} == 2`);
    return Object.keys(customers).length == 2;
}

function test_GuestsPreferSoybeanMilkWithCheats(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const customers = StallPingScheduler.findCustomers(db, ride, coords, {
        guestsIgnoreFavourite: true,
        guestsOnlyLike: "soybean_milk",
    });
    console.log(`Expect ${Object.keys(customers).length} == 2`);
    return Object.keys(customers).length == 2;
}

function test_GuestsDoNotPreferSoybeanMilkWithCheats(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const nearbyGuests = getGuestsOnNeighbouringTile(coords);
    const guest = <number>nearbyGuests[0].id;
    const modifiedEntries: Record<number, GuestFoodItemType> = {};
    modifiedEntries[guest] = "soybean_milk";
    const customers = StallPingScheduler.findCustomers(Object.assign(db, modifiedEntries), ride, coords, {
        guestsIgnoreFavourite: true,
        guestsOnlyLike: "pretzel",
    });
    console.log(`Expect ${Object.keys(customers).length} == 0`);
    return Object.keys(customers).length == 0;
}

export default function testSuite_stalls(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    runTest(test_SubSandwichStationTrackHasExpectedCoords);
    runTest(test_MoonJuiceStationTrackHasExpectedCoords);
    runTest(test_MoonJuiceStallHasExpectedName);
    runTest(test_SubSandwichStallFoundBySPS, [stallPingScheduler]);
    runTest(test_GuestsPreferSoybeanMilk, [{ ...db }, stallPingScheduler]);
    runTest(test_GuestsPreferSoybeanMilkWithCheats, [db, stallPingScheduler]);
    runTest(test_GuestsDoNotPreferSoybeanMilkWithCheats, [db, stallPingScheduler]);
    runTest(test_GuestsPreferEverythingWithCheats, [db, stallPingScheduler]);
}
