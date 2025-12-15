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
import { StallPingScheduler } from "../stalls";
import testSuite_guests from "./guests.test";
import testSuite_stalls from "./stalls.test";

export default function runTestSuites(db: GuestDb, stallPingScheduler: StallPingScheduler) {
    testSuite_guests(db);
    testSuite_stalls(db, stallPingScheduler);
}
