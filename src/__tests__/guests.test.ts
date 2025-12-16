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
import { checkGuestForVoucher } from "../util";
import { GuestDb } from "../globals";
import { delayedCheckGuestForVoucher } from "../main";
import { TestSuite } from "./TestSuite";

const suite = new TestSuite("guests");
export default suite;

suite.addTest("CheckGuestForVoucher", () => {
    const guest = map.getEntity(36);
    const voucher = checkGuestForVoucher(guest as Guest);
    console.log(`Expect "${voucher}" == "soybean_milk"`);
    return voucher == "soybean_milk";
});

suite.addTest("DelayedCheckGuestForVoucherMutatesDb", (db: GuestDb) => {
    const guest = map.getEntity(36);
    delayedCheckGuestForVoucher(db, guest as Guest, 1);
    console.log(`Expect "${db[guest.id!]}" == "soybean_milk"`);
    return db[guest.id!] == "soybean_milk";
});
