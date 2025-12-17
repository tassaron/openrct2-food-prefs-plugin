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
/// <reference path="../lib/duktape.d.ts" />

import { plugin } from "./meta";
import { consoleColour } from "./globals";

const isDuktapeAvailable = typeof Duktape !== "undefined";

type VerbosityLevel =
    | 0 // info
    | 1 // debug
    | 2; // verbose

export class Logger {
    name: string;
    verbosity: VerbosityLevel;
    prefix: string;

    constructor(name: string, verbosity: VerbosityLevel) {
        this.name = name;
        this.verbosity = verbosity;
        this.prefix = `\r[${plugin.pluginName} ${this.name}`;
    }

    verbose(text: string) {
        if (plugin.buildEnviron == "production" || this.verbosity < 2) return;
        console.log(`${this.prefix}] ${text}`);
    }

    debug(text: string) {
        if (plugin.buildEnviron == "production" || this.verbosity < 1) return;
        console.log(`${this.prefix} DEBUG] ${text}`);
    }

    info(text: string) {
        if (plugin.buildEnviron == "production") return;
        console.log(`${this.prefix} INFO] ${text}`);
    }

    warn(text: string) {
        console.log(`${this.prefix} ${consoleColour.yellow}WARN${consoleColour.reset}] ${text}`);
    }

    error(text: string) {
        console.log(
            `${plugin.pluginName} v${plugin.pluginVersion} ${this.name} ${consoleColour.red}ERROR${consoleColour.reset}] ${text}`,
        );
    }
}

/**
 * Below functions copied from Manticore-007's Peep Editor plugin
 * Huge thanks for showing me how to get stacktraces!
 */
function stacktrace(): string {
    if (!isDuktapeAvailable) {
        return "  (stacktrace unavailable)\r\n";
    }

    const depth = -4; // skips act(), stacktrace() and the calling method.
    let entry: DukStackEntry,
        result = "";

    for (let i = depth; (entry = Duktape.act(i)); i--) {
        const functionName = entry.function.name;
        const prettyName = functionName ? functionName + "()" : "<anonymous>";

        result += `   -> ${prettyName}: line ${entry.lineNumber}\r\n`;
    }
    return result;
}

/**
 * Enable stack-traces on errors in development mode.
 */
if (plugin.buildEnviron !== "production" && isDuktapeAvailable) {
    Duktape.errCreate = function onError(error): Error {
        error.message += "\r\n" + stacktrace();
        return error;
    };
}
