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
import { checkGuestForVoucher, createGuestDb, getFoodPrefStats } from "../guests";
import { TestSuite } from "./TestSuite";

const suite = new TestSuite("guests");
export default suite;

suite.addTest("CheckGuestForVoucher", () => {
    const guest = map.getEntity(36);
    const voucher = checkGuestForVoucher(guest as Guest);
    console.log(`Expect "${voucher}" == "soybean_milk"`);
    return voucher == "soybean_milk";
});

suite.addTest("GetFoodPrefStatsHasBurger33%", () => {
    const stats = getFoodPrefStats({ 1: "burger", 2: "ice_cream", 3: "popcorn" });
    console.log(`Expect ${stats["burger"]} == 33`);
    return stats["burger"] == 33;
});

suite.addTest("GetFoodPrefStatsHasNoIcedTea", () => {
    const stats = getFoodPrefStats(createGuestDb());
    console.log(`Expect ${stats["iced_tea"]} == 0}`);
    return stats["iced_tea"] == 0;
});
