/// <reference path="../lib/openrct2.d.ts" />

import { plugin } from "./meta";
import { main } from "./main";

registerPlugin({
    name: plugin.pluginName,
    version: plugin.pluginVersion,
    authors: ["Brianna Rainey <tassaron>"],
    type: "remote",
    licence: "GPL-3.0-only",
    /**
     * Version 110 equals the v0.4.29 release.
     * @see https://github.com/OpenRCT2/OpenRCT2/blob/v0.4.29/src/openrct2/scripting/ScriptEngine.h#L50
     */
    targetApiVersion: 110,
    main: main,
});
