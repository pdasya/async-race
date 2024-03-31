import TGetCars from '@core/types/types';
import { Endpoints, Methods } from '@core/types/enum';
import { ICar } from '@/core/types/interfaces';

const BASE = 'http://localhost:3000';

export default class Database {
    getCars = async (endpoint: string, page: number | string, limit: number | string = 7): Promise<TGetCars> => {
        const response = await fetch(`${BASE}/${endpoint}?_page=${page}&_limit=${limit}`);
        return {
            items: await response.json(),
            total: response.headers.get('X-Total-Count'),
        };
    };

    getCar = async (id: string): Promise<ICar> => {
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

    startEngine = async (id: string, status: string): Promise<{ velocity: number; distance: number }> => {
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

    getWinners = async (
        page: number | string,
        sort: string = '',
        order: string = '',
        limit: number | string = 10
      ): Promise<TGetCars> => {
        const response = await fetch(
          `${BASE}/${Endpoints.winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
        );
        return {
            items: await response.json(),
            total: response.headers.get('X-Total-Count'),
        };
    };

    getWinner = async (id: string): Promise<ICar> => {
        const response = await fetch(`${BASE}/${Endpoints.winners}/${id}`);
        return response.json();
    };

    updateWinner = async (id: string, body: { wins: number; time: number }): Promise<ICar> => {
        const response = await fetch(`${BASE}/${Endpoints.winners}/${id}`, {
            method: Methods.PUT,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.json();
    };

    deleteWinner = async (id: string): Promise<void> => {
        await fetch(`${BASE}/${Endpoints.winners}/${id}`, {
            method: Methods.DELETE,
        });
    };

    createWinner = async (id: number, wins: number, time: number): Promise<void> => {
        await fetch(`${BASE}/${Endpoints.winners}`, {
            method: Methods.POST,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                wins,
                time,
            }),
        });
    };
}
