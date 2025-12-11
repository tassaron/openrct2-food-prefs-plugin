import MockInstalledObject from "./InstalledObject.mock";

export default class MockRideObject implements RideObject {
    description: string = "";
    capacity: string = "";
    flags: number = 0;
    rideType: number[] = [];
    minCarsInTrain: number = 0;
    maxCarsInTrain: number = 0;
    carsPerFlatRide: number = 0;
    zeroCars: number = 0;
    tabVehicle: number = 0;
    defaultVehicle: number = 0;
    frontVehicle: number = 0;
    secondVehicle: number = 0;
    rearVehicle: number = 0;
    thirdVehicle: number = 0;
    vehicles: RideObjectVehicle[] = [];
    excitementMultiplier: number = 0;
    intensityMultiplier: number = 0;
    nauseaMultiplier: number = 0;
    maxHeight: number = 0;
    shopItemSecondary: number = 0;
    baseImageId: number = 0;
    numImages: number = 0;
    installedObject: InstalledObject;
    type: ObjectType = "ride";
    index: number = 0;
    identifier: string = "";
    legacyIdentifier: string = "";
    name: string = "";

    // props actually used by this plugin
    shopItem: number = 0;

    constructor(shopItem: number) {
        this.installedObject = new MockInstalledObject();
        this.shopItem = shopItem;
    }
}
