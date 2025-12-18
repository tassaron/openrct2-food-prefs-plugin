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
import { consoleColour } from "../globals";
import stalls from "./stalls.test";
import guests from "./guests.test";

export default function runTestSuites<A, T>(db: A, stallPingScheduler: T) {
    let failures = 0;
    failures += stalls.runSuite(db, stallPingScheduler);
    failures += guests.runSuite(db, stallPingScheduler);
    if (failures) {
        console.log(`${consoleColour.red}${failures} test${failures == 1 ? "" : "s"} failed${consoleColour.reset}`);
    } else {
        console.log(`${consoleColour.green}All tests passed!${consoleColour.reset}`);
    }
    return failures;
}
