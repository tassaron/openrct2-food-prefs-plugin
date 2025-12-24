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
import { GuestDb } from "../globals";
import { checkGuestForVoucher, getFoodPrefStats } from "../guests";
import { StallPingScheduler } from "../stalls";
import { arrayIncludes, getAvailableFood } from "../util";
import { TestSuite } from "./TestSuite";

const suite = new TestSuite("guests");
export default suite;

suite.addTest("CheckGuestForVoucher", () => {
    const guest = map.getEntity(36);
    const voucher = checkGuestForVoucher(guest as Guest);
    console.log(`Expect "${voucher}" == "soybean_milk"`);
    return voucher == "soybean_milk";
});

suite.addTest("SPSUsesCheckGuestForVoucher", (_, stallPingScheduler: StallPingScheduler) => {
    const db: GuestDb = {};
    StallPingScheduler.findCustomers(db, stallPingScheduler.stalls[31][0], stallPingScheduler.stalls[31][1], {});
    console.log(`Expect "${db[36]}" == "soybean_milk"`);
    return db[36] == "soybean_milk";
});

suite.addTest("GetFoodPrefStatsHasBurger33%", () => {
    const stats = getFoodPrefStats({ 1: "burger", 2: "ice_cream", 3: "popcorn" });
    console.log(`Expect ${stats["burger"]} == 33`);
    return stats["burger"] == 33;
});

suite.addTest("AvailableFoodScenarioHasNoIcedTea", () => {
    const foodAvailable = getAvailableFood("scenario");
    console.log(`Expect (arrayIncludes) ${arrayIncludes(foodAvailable, "iced_tea")} === false`);
    return arrayIncludes(foodAvailable, "iced_tea") === false;
});

suite.addTest("AvailableFoodScenarioHasWontonSoup", () => {
    const foodAvailable = getAvailableFood("scenario");
    console.log(`Expect (arrayIncludes) ${arrayIncludes(foodAvailable, "wonton_soup")} === true`);
    return arrayIncludes(foodAvailable, "wonton_soup") === true;
});

suite.addTest("AvailableFoodResearchedHasNoWontonSoup", () => {
    const foodAvailable = getAvailableFood("researched");
    console.log(`Expect (arrayIncludes) ${arrayIncludes(foodAvailable, "wonton_soup")} === false`);
    return arrayIncludes(foodAvailable, "wonton_soup") === false;
});
