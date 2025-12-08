# Guest Food Preferences for OpenRCT2

A plugin to give guests a preference for some food stalls over others.

## How it works

When loading a map, this plugin looks at what food/drinks are available to the player (either currently or in future due to research). All guests will be **assigned a food preference that is possible to satisfy** within the loaded scenario. The idea is to incentivize researching more than one type of food/drink stall.

At the **beginning of each in-game day**, each food/drink stall **lures guests for 3 seconds** (120 game ticks), setting and resetting their hunger/thirst appropriately so the guest will buy (assuming the item is not too expensive for them). This only works on the tile directly in front of a stall, ignores stalls that are closed, and ignores guests who already have an item that would prevent them from buying another.

### Known issues

- If you load new stalls into a map using the object selection window, you must save and reload the map before guests will be generated with a preference for the newly-loaded objects. (This refers to food stalls that are not normally obtainable even via research.) (This is probably fixable but not worth the effort?)
- Occasionally guests get stuck on the corner of a stall and thus don't buy anything, but they'll be safely freed and reset to normal once the luring period ends.

## Thanks

Huge thanks to the entire [OpenRCT2](https://github.com/OpenRCT2/OpenRCT2) team and community for keeping this classic game alive. Thanks to [Basssiiie](https://github.com/Basssiiie) for creating [OpenRCT2-Simple-Typescript-Template](https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template) and [OpenRCT2-FlexUI](https://github.com/Basssiiie/OpenRCT2-FlexUI).

## How to develop

### Setup

1. Install latest version of [Node](https://nodejs.org/en/).
2. Run `npm install` to install the project's dependencies.
3. Find `openrct2.d.ts` TypeScript API declaration file in OpenRCT2 files. copy it to `./lib/` folder.
    - This file can usually be found in the [OpenRCT2 installation directory](#openrct2-installation-directory).
    - Alternatively you can download the file from Github [here](https://raw.githubusercontent.com/OpenRCT2/OpenRCT2/develop/distribution/openrct2.d.ts).
    - Another option is to make a symbolic link instead of copying the file, which will keep the file up to date whenever you install new versions of OpenRCT2.

### Commands

#### `npm run build`

Creates a release build of the plugin. This version is optimized for sharing with others, using Terser to make the file as small as possible. By default, the plugin will be outputted to `./dist/`.

#### `npm run build:dev`

Creates a develop build of the plugin. This version is not optimized for sharing, but easier to read in case you want to see the outputted Javascript. By default, the plugin will be outputted in the plugin folder of the default OpenRCT2 user directory.

#### `npm start` or `npm run start`

Will start a script that will automatically run `npm run build:dev` every time you make a change to any Typescript or Javascript file inside the `./src/` folder.

### Hot reload

This project supports the [OpenRCT2 hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) for development.

1. Navigate to your OpenRCT2 user directory and open the `config.ini` file.
2. Enable hot reload by setting `enable_hot_reloading = true` in `config.ini`.
3. Run `npm start` in the directory of this project to start the hot reload server.
4. Start the OpenRCT2 and load a save or start a new game.
5. Each time you save any of the files in `./src/`, the server will compile `./src/plugin.ts` and place the compiled plugin file inside your local OpenRCT2 plugin directory.
6. OpenRCT2 will notice file changes and it will reload the plugin.

### Why do minor variables use a random word instead of something idiomatic like `i`?

That is my (in my opinion) humourous yet futile attempt to frustrate machine learning. It's GPL-licensed for similar futile reasons. If you want to change these variable names, the default keybinding for find-replace is CTRL+H in most editors.
