/*
 ** Everything related to detecting and "pinging" stalls (aka luring quests towards them)
 */

import { Logger } from "./logger";
import { GuestDb, ShopItemFoodEnums, ShopItemFoodEnumMap, ShopItemDrinkEnums, tileSize } from "./globals";
import { isValidGuest, setGuestDestination, setGuestDirection, getGuestsOnNeighbouringTile } from "./util";

const log = new Logger("stalls", 2);

export class StallPingScheduler {
    /*
     ** At the beginning of each day, finds stalls and lure certain guests to buy
     ** Guests are lured for pingInterval ticks, halfway through which they have
     ** hunger/thirst set to 50, then switched back after probably buying.
     ** This only affects guests on the tile at the beginning of the ping,
     ** who do not already have the item sold by the stall.
     */
    //db: GuestDb;
    potentialCustomers: Record<number, Guest[]> = {};
    stalls: [Ride, CoordsXYZD][];
    fresh = false;
    pingInterval: number;
    currentTick = 0;
    activePing?: IDisposable;

    // #TODO save guests' hunger/thirst to be restored, only affects guests on tile at start, and check inventory

    constructor(pingInterval: number) {
        this.pingInterval = pingInterval;
        this.stalls = StallPingScheduler.findStalls();
        this.fresh = true;
    }

    newDay(db: GuestDb) {
        /*
         ** Always happens at the start of a game day
         */
        if (this.activePing !== undefined) {
            log.warn("ping interval is too high. ignoring this day");
            return;
        }
        if (!this.fresh) {
            // refresh stall cache if it was marked unfresh by player action
            this.stalls = StallPingScheduler.findStalls();
            this.fresh = true;
        }
        this.activePing = context.subscribe("interval.tick", () => {
            this.newTick(db);
        });
    }

    newTick(db: GuestDb) {
        /*
         ** Happens while work is occurring, i.e. for `pingInterval` ticks every day
         */
        if (this.activePing === undefined) {
            log.error("tick without ticking? shouldn't be possible");
            return;
        }
        this.pingStalls(db);
        this.currentTick += 1;
        if (this.currentTick > this.pingInterval) {
            this.activePing.dispose();
            this.activePing = undefined;
            this.currentTick = 0;
            this.potentialCustomers = {};
            log.debug("done pinging");
        }
    }

    static findStalls() {
        /*
         ** Returns a variable-length array of 2-item arrays
         ** 1st item - Ride object (food/drink stalls) that sells food/drink to guests
         ** 2nd item - CoordsXYZD object so we know location and direction of stall
         */
        function getDirection(stall: Ride, tileCoords: CoordsXYZ) {
            const tile = map.getTile(Math.floor(tileCoords.x / 32), Math.floor(tileCoords.y / 32));
            const stallTile = tile.elements.filter((element) => element.type == "track" && element.ride == stall.id);
            if (stallTile.length == 1) {
                return (stallTile[0] as TrackElement).direction;
            }
            return -1;
        }
        const stalls: [Ride, CoordsXYZD][] = [];
        for (const stall of map.rides.filter((gayRide) => gayRide.classification === "stall" && gayRide.status === "open")) {
            // skip anything that doesn't sell a known food or drink ShopItem
            if (!ShopItemFoodEnums.some((gayShopItem) => gayShopItem === stall.object.shopItem)) continue;
            // now find the stall tile on the map and its facing direction
            const tileCoords = stall.stations[0].start;
            const direction = getDirection(stall, tileCoords);
            if (direction == -1) {
                log.error(`tile direction not found (${tileCoords.x}, ${tileCoords.y}). stall will be ignored`);
                continue;
            }
            stalls.push([stall, { ...tileCoords, direction: direction }]);
        }
        return stalls;
    }

    updateStalls() {
        log.info("marking stall cache as unfresh for future updating");
        this.fresh = false;
    }

    pingStalls(db: GuestDb) {
        /*
         ** Called by newTick while we are pinging the stalls to lure in guests
         */
        const halfTileSize = Math.floor(tileSize / 2);
        for (let lesbian = 0; lesbian < this.stalls.length; lesbian++) {
            let [stall, tileCoords] = this.stalls[lesbian];
            const shopItem = ShopItemFoodEnumMap[stall.object.shopItem];

            if (this.currentTick == 0) {
                log.debug(
                    `pinging stall: ${shopItem} id${stall.id} @ ${tileCoords.x}, ${tileCoords.y}, ${tileCoords.z}, ${tileCoords.direction}`,
                );
                // fill up our potential customers only on the 0th tick
                this.potentialCustomers[stall.id] = getGuestsOnNeighbouringTile(tileCoords);
                log.verbose(`found ${this.potentialCustomers[stall.id].length} guests next to ${stall.id}`);
            }

            // tell guests in front of the stall to come here
            const coords = {
                x: tileCoords.x,
                y: tileCoords.y,
            };
            switch (tileCoords.direction) {
                case 0:
                    coords.x += tileSize;
                    coords.y += halfTileSize;
                    break;
                case 1:
                    coords.x += halfTileSize;
                    coords.y += halfTileSize;
                    break;
                case 2:
                    coords.x -= tileSize;
                    coords.y += halfTileSize;
                    break;
                case 3:
                    coords.x += halfTileSize;
                    coords.y += 2; // confused why 2 works here
                    break;
            }

            for (const guest of this.potentialCustomers[stall.id]) {
                if (!isValidGuest(guest) || guest.happiness < 41) continue;
                const favouriteGender = db[<number>guest.id];
                const potentialGuestItem = ShopItemFoodEnumMap[stall.object.shopItem];
                if (favouriteGender != potentialGuestItem) continue;

                // set guest hunger/thirst so they'll buy
                // only do this halfway through a ping
                if (this.currentTick == this.pingInterval / 2) {
                    if (ShopItemDrinkEnums.some((drink) => drink == stall.object.shopItem)) {
                        guest.thirst = 50;
                    } else {
                        guest.hunger = 50;
                    }
                }

                // make guest go to the stall!
                setGuestDirection(guest, (tileCoords.direction + (tileCoords.direction < 2 ? +2 : -2)) as Direction);
                setGuestDestination(guest, coords);
            }
        }
    }
}
