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
import { getGuestsOnNeighbouringTile } from "../guests";
import { TestSuite } from "./TestSuite";

const suite = new TestSuite("stalls");
export default suite;

suite.addTest("SubSandwichStationTrackHasExpectedCoords", () => {
    const coords = map.rides[22].stations[0].start;
    console.log(`Expect ${Math.floor(coords.x / tileSize)} == 2 && ${Math.floor(coords.y / tileSize)} == 13`);
    return Math.floor(coords.x / tileSize) == 2 && Math.floor(coords.y / tileSize) == 13;
});

suite.addTest("MoonJuiceStationTrackHasExpectedCoords", () => {
    // facing a different direction from the above
    const coords = map.rides[30].stations[0].start;
    map.rides[30].name == "Moon Juice 1";
    console.log(`Expect ${Math.floor(coords.x / tileSize)} == 10 && ${Math.floor(coords.y / tileSize)} == 9`);
    return Math.floor(coords.x / tileSize) == 10 && Math.floor(coords.y / tileSize) == 9;
});

suite.addTest("MoonJuiceStallHasExpectedName", () => {
    const name = map.rides[30].name;
    console.log(`Expect "${name}" == "Moon Juice 1"`);
    return name == "Moon Juice 1";
});

suite.addTest("SubSandwichStallFoundBySPS", (_, stallPingScheduler: StallPingScheduler) => {
    const shopItem = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 22;
    })[0][0].object.shopItem;
    console.log(`Expect "${ShopItemFoodEnumMap[shopItem]}" == "sub_sandwich"`);
    return ShopItemFoodEnumMap[shopItem] == "sub_sandwich";
});

suite.addTest("GuestsPreferSoybeanMilk", (db: GuestDb, stallPingScheduler: StallPingScheduler) => {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const nearbyGuests = getGuestsOnNeighbouringTile(coords);
    const modifiedEntries: Record<number, GuestFoodItemType> = {};
    modifiedEntries[<number>nearbyGuests[0].id] = "soybean_milk";
    modifiedEntries[<number>nearbyGuests[1].id] = "burger";
    const customers = StallPingScheduler.findCustomers(Object.assign(db, modifiedEntries), ride, coords, {});
    console.log(`Expect ${Object.keys(customers).length} == 1`);
    return Object.keys(customers).length == 1;
});

suite.addTest("GuestsPreferEverythingWithCheats", (db: GuestDb, stallPingScheduler: StallPingScheduler) => {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const customers = StallPingScheduler.findCustomers(db, ride, coords, { guestsIgnoreFavourite: true });
    console.log(`Expect ${Object.keys(customers).length} == 2`);
    return Object.keys(customers).length == 2;
});

suite.addTest("GuestsPreferSoybeanMilkWithCheats", (db: GuestDb, stallPingScheduler: StallPingScheduler) => {
    const [ride, coords] = stallPingScheduler.stalls.filter((stall: [Ride, CoordsXYZD]) => {
        return stall[0].id == 31;
    })[0];
    const customers = StallPingScheduler.findCustomers(db, ride, coords, {
        guestsIgnoreFavourite: true,
        guestsOnlyLike: "soybean_milk",
    });
    console.log(`Expect ${Object.keys(customers).length} == 2`);
    return Object.keys(customers).length == 2;
});

suite.addTest("GuestsDoNotPreferSoybeanMilkWithCheats", (db: GuestDb, stallPingScheduler: StallPingScheduler) => {
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
});
