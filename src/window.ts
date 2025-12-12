import { Logger } from "./logger";
import { GuestDb } from "./globals";
import { isValidGuest } from "./util";
import { box, checkbox, dropdown, groupbox, label, listview, viewport, window, vertical, horizontal } from "openrct2-flexui";

const log = new Logger("window", 1);

function createListOfGuests(db: GuestDb, _cleanup: (n: number[]) => void) {
    const lgbt: string[][] = [];
    const rubbish: number[] = [];
    if (!db) {
        log.error("missing entire GuestDb");
        return [];
    }

    for (const id of Object.getOwnPropertyNames(db).map(Number)) {
        const guest = map.getEntity(id);
        if (!isValidGuest(guest)) {
            // remember invalid entries to be cleaned up later
            log.debug(`${id} is invalid. removing later`);
            rubbish.push(id);
            continue;
        }
        lgbt.push([(guest as Guest).name, db[Number(guest.id)]]);
    }
    // cleanup outdated entries
    _cleanup(rubbish);
    return lgbt;
}

export function createWindow(db: GuestDb, _cleanup: (n: number[]) => void) {
    return window({
        title: "Food Preferences",
        width: { value: 240, min: 200, max: 960 },
        height: { value: 480, min: 340, max: 1200 },
        content: [
            box({
                text: "Food Preference Statistics",
                content: vertical([
                    label({
                        text: "Burger 30%",
                    }),
                    label({
                        text: "Drink 30%",
                    }),
                    label({
                        text: "Unknown 40%",
                    }),
                ]),
            }),
            groupbox({
                content: [
                    listview({
                        columns: [
                            { header: "Guest", canSort: false },
                            {
                                header: "Favourite Item",
                                canSort: true,
                                tooltip: "guest will sometimes buy this item when they otherwise would not",
                            },
                        ],
                        items: createListOfGuests(db, _cleanup),
                        onClick: (item: number, column: number) =>
                            console.log(`Clicked item ${item} in column ${column} in listview`),
                    }),
                    viewport({
                        target: map.getAllEntities("guest")[0]?.id,
                    }),
                ],
            }),
            box({
                text: "Cheats",
                content: vertical({
                    content: [
                        horizontal({
                            content: [
                                checkbox({
                                    disabled: true,
                                    text: "Guests only like:",
                                    tooltip: "normal guest preference is ignored in favour of the selected option",
                                    onChange: (checked: boolean) =>
                                        console.log(`Checkbox has changed to ${checked ? "" : "not "}checked`),
                                }),
                                dropdown({
                                    disabled: true,
                                    items: ["Everything", "Burger", "Drink"],
                                    onChange: (index: number) => console.log(`Dropdown changed to index ${index}`),
                                }),
                            ],
                        }),
                        checkbox({
                            disabled: true,
                            isChecked: true,
                            text: "Show unknown foods",
                            tooltip: "not implemented: unresearched foods will be hidden in the future",
                            //tooltip: "show foods that have not been unlocked via research",
                            onChange: (checked: boolean) =>
                                console.log(`Checkbox has changed to ${checked ? "" : "not "}checked`),
                        }),
                    ],
                }),
            }),
        ],
    });
}
