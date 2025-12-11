const junkCoords = {
    x: 0,
    y: 0,
    z: 0,
    direction: <Direction>0,
};

export default class MockRideStation implements RideStation {
    start: CoordsXYZ;

    //unused by plugin at the moment
    length: number = 0;
    entrance: CoordsXYZD = junkCoords;
    exit: CoordsXYZD = junkCoords;

    constructor(start: CoordsXYZ) {
        this.start = start;
    }
}
