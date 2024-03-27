// eslint-disable-next-line import/no-unresolved, import/extensions
import TGetCars from '@core/types/types';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Endpoints, Methods } from '@core/types/enum';

const BASE = 'http://localhost:3000';

export default class Database {
    getCars = async (endpoint: string, page: number, limit: number = 7): Promise<TGetCars> => {
        const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
        return {
            items: await response.json(),
            total: response.headers.get('X-Total-Count'),
        };
    };

    createCar = async (name: string, color: string): Promise<void> => {
        await fetch(`${BASE}/${Endpoints.garage}`, {
            method: Methods.POST,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                color,
            }),
        });
    };

    updateCar = async (name: string, color: string, id: string): Promise<void> => {
        await fetch(`${BASE}/${Endpoints.garage}/${id}`, {
            method: Methods.PUT,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                color,
            }),
        });
    };

    deleteCar = async (id: string): Promise<void> => {
        await fetch(`${BASE}/${Endpoints.garage}/${id}`, {
            method: Methods.DELETE,
        });
    };
}
