import MockRide from "./Ride.mock";

type MockMap = Record<number, Record<number, Tile>>;
type MockMapOptions = {
    map?: MockMap;
    rides?: MockRide[];
};

export default class MockGameMap implements GameMap {
    rides: Ride[] = [];
    size: CoordsXY = { x: 0, y: 0 };
    numRides: number = 0;
    numEntities: number = 0;

    // mock stuff, not on real object
    _mockMap: MockMap;

    constructor(options: MockMapOptions) {
        /*
         ** _mockMap = {
         **     x: {
         **         y: MockTile
         **     }
         ** }
         */
        // #TODO set x and y on tiles here
        this._mockMap = options["map"] ? options["map"] : {};
        this.rides = options["rides"] ? options["rides"] : [];
    }

    getRide(id: number): Ride {
        throw new Error("Method not implemented.");
    }
    getTile(x: number, y: number): Tile {
        return this._mockMap[x][y];
    }
    getEntity(id: number): Entity {
        throw new Error("Method not implemented.");
    }
    getAllEntities<T>(type: EntityType): T[] {
        return [];
    }
    getAllEntitiesOnTile<T>(type: EntityType, tilePos: CoordsXY): T[] {
        return [];
    }
    createEntity(type: EntityType, initializer: object): Entity {
        throw new Error("Method not implemented.");
    }
    getTrackIterator(location: CoordsXY, elementIndex: number): TrackIterator | null {
        throw new Error("Method not implemented.");
    }
}
