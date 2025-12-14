/**
 ** Meta-configuration for the plugin
 ** Update here when bumping version
 **/
import runTestSuites from "./__tests__/stalls.test";

export const plugin = {
    pluginName: "Food Prefs",
    pluginVersion: "1.0-alpha",
    buildEnviron: "_BUILD_ENVIRON_", // rollup replaces with `BUILD` environment variable
    runTestSuites: (stallPingScheduler: any) => {
        return runTestSuites(stallPingScheduler);
    },
};
