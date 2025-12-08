/*
 ** FUNCTIONS! Do not import anything aside from globals; it will cause bundling issues.
 */

import { GuestFoodItemType, tileSize } from "./globals";

export function createFavouriteFood(availableFoods: GuestFoodItemType[]) {
    const food: GuestFoodItemType = availableFoods[context.getRandom(0, availableFoods.length)];
    return food;
}

export function isValidGuest(guest: Entity) {
    return !(guest === null || guest.id === null || !(guest as Guest).items);
}

export function setGuestDestination(guest: Guest, coords: CoordsXY) {
    guest.destination = coords;
}

export function setGuestDirection(guest: Guest, direction: Direction) {
    guest.direction = direction;
}

export function getGuestsOnNeighbouringTile(origin: CoordsXYZD) {
    /*
     ** 0 is the direction facing map edge spanning ((1, maxY), (1, 1))
     ** 1 is the direction facing map edge spanning ((maxX, maxY), (1, maxY))
     ** 2 is the direction facing map edge spanning ((maxX, maxY), (maxX, 1))
     ** 3 is the direction facing map edge spanning ((1, 1), (maxX, 1))
     **
     ** this origin is by pixel so when moving positively we must add `tileSize`
     */

    switch (origin.direction) {
        case 0:
            // #TODO filter for z coord??
            return map.getAllEntitiesOnTile("guest", map.getTile(origin.x - 1, origin.y));
        case 1:
            return map.getAllEntitiesOnTile("guest", map.getTile(origin.x, origin.y + tileSize + 1));
        case 2:
            return map.getAllEntitiesOnTile("guest", map.getTile(origin.x + tileSize + 1, origin.y));
        case 3:
            return map.getAllEntitiesOnTile("guest", map.getTile(origin.x, origin.y - 1));
    }
}

export function arrayIncludes(arr: any[], val: any) {
    /*
     ** because I don't understand why .includes() doesn't work :)
     */
    return arr.some((transgender) => {
        return transgender == val;
    });
}
