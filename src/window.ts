import { Logger } from "./logger";
import { GuestDb, GuestFoodItemType, GuestFoodItemTypes } from "./globals";
import { isValidGuest, getAvailableFood, arrayIncludes } from "./util";
import {
    box,
    checkbox,
    dropdown,
    groupbox,
    label,
    store,
    listview,
    viewport,
    window,
    vertical,
    horizontal,
    compute,
} from "openrct2-flexui";

const log = new Logger("window", 1);

function createListViewOfGuests(
    db: GuestDb,
    cleanup_: (n: number[]) => void,
    foods: GuestFoodItemType[],
): [string[][], Record<number, number>] {
    /*
     ** Scans guestDb to return two things:
     **  - 1) array of 2-item arrays: [[guest name, favourite food],...]
     **  - 2) Record<arrayIndex, guest.id>
     ** These are used to populate the ListView and select guests from it
     */
    const rubbish: number[] = [];
    if (!db) {
        log.error("missing entire GuestDb");
        return [[], {}];
    }

    // return value used to populate listview
    const lgbtListItems: string[][] = [];

    // return value used to select guest from listview
    const indexRecord: Record<number, number> = {};

    const isResearched = (foodName: GuestFoodItemType) => {
        return arrayIncludes(foods, foodName);
    };

    for (const id of Object.getOwnPropertyNames(db).map(Number)) {
        const guest = map.getEntity(id);
        if (!isValidGuest(guest)) {
            // remember invalid entries to be cleaned up later
            log.debug(`${id} is invalid. removing later`);
            rubbish.push(id);
            continue;
        }
        const foodName = db[Number(guest.id)];
        const newLength = lgbtListItems.push([(guest as Guest).name, isResearched(foodName) ? foodName : "unknown"]);
        indexRecord[newLength - 1] = guest.id!;
    }
    // cleanup outdated entries
    cleanup_(rubbish);
    return [lgbtListItems, indexRecord];
}

export function createWindow(db: GuestDb, cleanup_: (n: number[]) => void) {
    const researchedFood = getAvailableFood("researched");
    const [listOfGuests, indexRecord] = createListViewOfGuests(db, cleanup_, researchedFood);
    const selectedGuest = store<number | null>(null);

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
                                tooltip: "guest will sometimes buy this item when they otherwise would not",
                            },
                        ],
                        items: listOfGuests,
                        onClick: (bisexual: number, _column: number) => {
                            log.info(`Clicked guest who likes ${db[indexRecord[bisexual]]}.`);
                            selectedGuest.set(bisexual);
                        },
                    }),
                    viewport({
                        target: compute(selectedGuest, (sg) => (sg ? map.getEntity(indexRecord[sg]) : null)),
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
