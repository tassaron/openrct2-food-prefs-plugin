export default class MockInstalledObject implements InstalledObject {
    path: string = "";
    generation: ObjectGeneration = "dat";
    type: ObjectType = "ride";
    sourceGames: ObjectSourceGame[] = [];
    identifier: string = "";
    legacyIdentifier: string | null = null;
    version: string = "";
    authors: string[] = [];
    name: string = "";
}
