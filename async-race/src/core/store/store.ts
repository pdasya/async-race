// eslint-disable-next-line import/no-unresolved
import EventObserver from '@core/eventObservers/eventObserver';
import type { ICar } from '@core/types/interfaces';

type TStore = ICar | HTMLDivElement | HTMLInputElement;
export default class Store {
    static event: Map<string, EventObserver<unknown>> = new Map();

    static store: Map<string, TStore> = new Map();

    static currentPage: number = 1;

    static getCurrentPage(): number {
        return Store.currentPage;
    }

    static setCurrentPage(page: number): void {
        Store.currentPage = page;
    }

    static addToStore(key: string, value: TStore) {
        Store.store.set(key, value);
    }

    static removeFromStore(key: string) {
        Store.store.delete(key);
    }

    static getFromStore(key: string): TStore | undefined {
        return Store.store.get(key);
    }

    static getEvent(): Map<string, EventObserver<unknown>> {
        return Store.event;
    }

    static addToEvent(key: string, value: EventObserver<unknown>) {
        Store.event.set(key, value);
    }

    static removeEvent(key: string): void {
        Store.event.delete(key);
    }
}
