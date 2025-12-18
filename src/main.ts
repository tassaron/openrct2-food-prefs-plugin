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

import { plugin } from "./meta";
import { FoodCheats } from "./globals";
import { StallPingScheduler } from "./stalls";
import { createWindow } from "./window";
import { WindowTemplate } from "openrct2-flexui";
import runTestSuites from "./__tests__/TestRunner";
import { createGuestDb, scheduledCleanup } from "./guests";

function onClickMenuItem(window: WindowTemplate) {
    // Occurs when player clicks our menu item
    window.open();
}

function onActionExecuted(stallPingScheduler: StallPingScheduler, e: GameActionEventArgs) {
    if ((e.action == "ridedemolish" || e.action == "ridesetstatus") && !e.isClientOnly && !e.result.error) {
        stallPingScheduler.updateStalls();
    }
}

export function main() {
    // Happens on startup of the plugin

    if (context.mode != "normal") {
        // Only run when player is in a park
        return;
    }

    // Load/create GuestDb for this park
    const db = createGuestDb();

    const cheats: FoodCheats = {
        guestsIgnoreFavourite: false,
        guestsOnlyLike: undefined,
        showUnresearchedFood: false,
    };

    const stallPingScheduler = new StallPingScheduler(120);
    let cleanUpTaskRunning: number | null = null;
    context.subscribe("interval.day", () => {
        stallPingScheduler.newDay(db, cheats);
        updateWindow(db);
        if (cleanUpTaskRunning === null) {
            cleanUpTaskRunning = context.setTimeout(() => {
                scheduledCleanup(db);
                cleanUpTaskRunning = null;
            }, 3500);
        }
    });
    context.subscribe("action.execute", (e: GameActionEventArgs) => onActionExecuted(stallPingScheduler, e));
    const [window_, updateWindow] = createWindow(db, cheats);

    // Register a menu item under the map icon:
    if (typeof ui !== "undefined") {
        ui.registerShortcut({
            id: "food-prefs.openwindow",
            text: "Open Food Preferences window",
            bindings: ["CTRL+F"],
            callback: () => onClickMenuItem(window_),
        });
        ui.registerMenuItem("Food Preferences", () => onClickMenuItem(window_));
    }

    // run tests one second after loading
    // tests will be treeshaken by rollup if not testing
    if (plugin.buildEnviron == "testing") {
        context.setTimeout(() => runTestSuites(db, stallPingScheduler), 1000);
    }
}
