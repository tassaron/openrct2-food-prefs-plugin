import { expect, test } from "@jest/globals";

import { StallPingScheduler } from "../stalls";
import { ShopItemFoodEnumMap } from "../globals";
import MockGameMap from "../__mocks__/GameMap.mock";
import MockTile from "../__mocks__/Tile.mock";
import MockRide from "../__mocks__/Ride.mock";
import MockRideStation from "../__mocks__/RideStation.mock";
import MockTrackElement from "../__mocks__/TileElement.mock";

let map: MockGameMap;

beforeAll(() => {
    map = new MockGameMap({
        map: {
            0: {
                0: new MockTile(0, 0, [new MockTrackElement(0, 0)]),
            },
        },
        rides: [new MockRide(0, 6, [new MockRideStation({ x: 0, y: 0, z: 0 })])],
    });
});

test("map has tile at 0,0", () => {
    const tile = map.getTile(0, 0);
    return expect(tile.x).toBe(0);
});

test("burger ride has rideobject with shopitem", () => {
    const burger = map.rides[0].object.shopItem;
    return expect(ShopItemFoodEnumMap[burger]).toBe("burger");
});

test("map has burger stall tile", () => {
    const tileCoords = map.rides[0].stations[0].start;
    return expect(tileCoords).toMatchObject({ x: 0, y: 0, z: 0 });
});

test("initialize StallPingScheduler", () => {
    const stallPingScheduler = new StallPingScheduler(120, map);
    return expect(stallPingScheduler.stalls[0][0]).toEqual(map.rides[0]);
});
