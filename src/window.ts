import { Logger } from "./logger";
import { GuestDb, GuestFoodArray } from "./globals";
import { isValidGuest, arrayIncludes } from "./util";

const log = new Logger("window", 1);

export function showWindow(db: GuestDb, _cleanup: (n: number[]) => void) {
    const rubbish: number[] = [];
    if (!db) {
        log.error("missing entire GuestDb");
        return;
    }

    for (const id of Object.getOwnPropertyNames(db).map(Number)) {
        const guest = map.getEntity(id);
        if (!isValidGuest(guest)) {
            // remember invalid entries to be cleaned up later
            log.debug(`${id} is invalid. removing later`);
            rubbish.push(id);
            continue;
        }
        try {
            for (const item of (guest as Guest).items) {
                if (arrayIncludes(GuestFoodArray, item.type)) {
                    log.info(`${(guest as Guest).name} (${(guest as Guest).id}) has ${item.type}`);
                } else if (item.type === "voucher" && (item as Voucher).voucherType === "food_drink_free") {
                    log.info(`${(guest as Guest).name} has a voucher for free ${(item as FoodDrinkVoucher).item}`);
                } else {
                    log.verbose(`${(guest as Guest).name} has ${(guest as Guest).items.length} items`);
                }
            }
        } catch (e) {
            let msg: string;
            if (e instanceof Error) {
                msg = e.message;
            } else {
                msg = e as string;
            }
            log.error(`exception during iteration: ${msg}`);
        }
    }
    // cleanup outdated entries
    _cleanup(rubbish);
}
