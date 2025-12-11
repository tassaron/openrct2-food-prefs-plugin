import MockRideObject from "./RideObject.mock";
import MockRideStation from "./RideStation.mock";

export default class MockRide implements Ride {
    type: number = 0;
    name: string = "";
    lifecycleFlags: number = 0;
    mode: number = 0;
    departFlags: number = 0;
    minimumWaitingTime: number = 0;
    maximumWaitingTime: number = 0;
    vehicles: number[] = [];
    vehicleColours: VehicleColour[] = [];
    colourSchemes: TrackColour[] = [];
    stationStyle: number = 0;
    music: number = 0;
    price: number[] = [];
    excitement: number = 0;
    intensity: number = 0;
    nausea: number = 0;
    totalCustomers: number = 0;
    buildDate: number = 0;
    age: number = 0;
    runningCost: number = 0;
    totalProfit: number = 0;
    inspectionInterval: number = 0;
    value: number = 0;
    downtime: number = 0;
    liftHillSpeed: number = 0;
    maxLiftHillSpeed: number = 0;
    minLiftHillSpeed: number = 0;
    satisfaction: number = 0;
    maxSpeed: number = 0;
    averageSpeed: number = 0;
    rideTime: number = 0;
    rideLength: number = 0;
    maxPositiveVerticalGs: number = 0;
    maxNegativeVerticalGs: number = 0;
    maxLateralGs: number = 0;
    totalAirTime: number = 0;
    numDrops: number = 0;
    numLiftHills: number = 0;
    highestDropHeight: number = 0;
    breakdown: BreakdownType = "brakes_failure";

    // stuff actuallu used by plugin
    classification: RideClassification = "stall";
    id: number;
    object: RideObject;
    status: RideStatus = "open";
    stations: RideStation[] = [];

    setBreakdown(breakdown: BreakdownType): void {
        throw new Error("Method not implemented.");
    }
    fixBreakdown(): void {
        throw new Error("Method not implemented.");
    }

    constructor(index: number, shopItem: number, stations: MockRideStation[]) {
        this.id = index;
        this.object = new MockRideObject(shopItem);
        this.stations = stations;
    }
}
