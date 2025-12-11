export default class MockTile implements Tile {
    x: number;
    y: number;
    elements: TileElement[];
    numElements: number;

    //@ts-expect-error
    data: Uint8Array<ArrayBufferLike>;

    constructor(x: number, y: number, elements: TileElement[]) {
        this.x = x;
        this.y = y;
        this.elements = elements;
        this.numElements = elements.length;
    }

    getElement<T extends TileElement>(index: number): TileElement | T {
        throw new Error("Method not implemented.");
    }
    insertElement(index: number): TileElement {
        throw new Error("Method not implemented.");
    }
    removeElement(index: number): void {
        throw new Error("Method not implemented.");
    }
}
