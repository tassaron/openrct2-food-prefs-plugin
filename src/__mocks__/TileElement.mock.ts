export default class MockTrackElement implements TrackElement {
    type: "track" = "track";
    trackType: number = 0;
    rideType: number = 0;
    sequence: number | null = null;
    mazeEntry: number | null = null;
    colourScheme: number | null = null;
    seatRotation: number | null = null;
    station: number | null = null;
    brakeBoosterSpeed: number | null = null;
    hasChainLift: boolean = false;
    isInverted: boolean = false;
    hasCableLift: boolean = false;
    isHighlighted: boolean = false;
    baseHeight: number = 0;
    baseZ: number = 0;
    clearanceHeight: number = 0;
    clearanceZ: number = 0;
    occupiedQuadrants: number = 0;
    isGhost: boolean = false;
    isHidden: boolean = false;

    // stuff used by plugin
    direction: Direction;
    ride: number;

    constructor(index: number, direction: Direction) {
        this.ride = index;
        this.direction = direction;
    }
}
