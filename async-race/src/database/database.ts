// eslint-disable-next-line import/no-unresolved, import/extensions
import TGetCars from '@core/types/types';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Endpoints, Methods } from '@core/types/enum';

const BASE = 'http://127.0.0.1:3000';

export default class Database {
    getCars = async (endpoint: string, page: number | string, limit: number | string = 7): Promise<TGetCars> => {
        const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
        return {
            items: await response.json(),
            total: response.headers.get('X-Total-Count'),
        };
    };

    getCar = async (id: string) => {
        const response = await fetch(`${BASE}/${Endpoints.garage}/${id}`);
        return response.json();
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

    startEngine = async (id: string, status: string) => {
        const response = await fetch(`${BASE}/${Endpoints.engine}?id=${id}&status=${status}`, {
            method: Methods.PATCH,
        });
        return response.json();
    };

    switchCarEngine = async (id: string, status: string): Promise<Response> => {
        const response = await fetch(`${BASE}/${Endpoints.engine}?id=${id}&status=${status}`, {
            method: Methods.PATCH,
        });
        return response;
    };
}
