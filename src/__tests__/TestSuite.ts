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

export class TestSuite {
    name: string;
    tests: [string, (...args: any[]) => boolean][] = [];

    constructor(name: string) {
        this.name = name;
    }

    addTest<A extends any[]>(name: string, testFunc: (...args: A) => boolean) {
        this.tests.push([name, testFunc]);
    }

    runTest<A extends any[]>(name: string, testFunc: (...args: A) => boolean, args: A) {
        console.log(`~-~-~-~-~~-~-~-~-~~-~-~-~-~\n\nRunning ${name}...`);
        let result;
        result = testFunc(...args);

        console.log(`${result ? "WOOHOO!" : "OUCH!"} ${name} ${result ? "PASSED :)" : "FAILED :("}`);
    }

    runSuite<A extends any[]>(...args: A) {
        for (const [name, testFunc] of this.tests) {
            ////@ts-expect-error
            this.runTest(name, testFunc, args);
        }
    }
}
