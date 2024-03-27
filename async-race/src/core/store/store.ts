// eslint-disable-next-line import/no-unresolved, import/extensions
import EventObserver from '@core/eventObservers/eventObserver';

export default class Store {
    static store: Map<string, EventObserver<unknown>> = new Map();

    static getStore(): Map<string, EventObserver<unknown>> {
        return Store.store;
    }

    static addToStore(key: string, value: EventObserver<unknown>) {
        Store.store.set(key, value);
    }

    static remove(key: string): void {
        Store.store.delete(key);
    }
}
