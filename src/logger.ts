import { plugin } from "./meta";

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
        this.prefix = `${plugin.pluginName} ${this.name}`;
    }

    verbose(text: string) {
        if (plugin.buildEnviron == "production" || this.verbosity < 2) return;
        console.log(`[${this.prefix}] ${text}`);
    }

    debug(text: string) {
        if (plugin.buildEnviron == "production" || this.verbosity < 1) return;
        console.log(`[${this.prefix} DEBUG] ${text}`);
    }

    info(text: string) {
        if (plugin.buildEnviron == "production") return;
        console.log(`[${this.prefix} INFO] ${text}`);
    }

    warn(text: string) {
        console.log(`[${this.prefix} WARN] ${text}`);
    }

    error(text: string) {
        console.log(`[${plugin.pluginName} v${plugin.pluginVersion} ${this.name} ERROR] ${text}`);
    }
}
