// eslint-disable-next-line import/no-unresolved, import/extensions
import { ICar } from '../core/types/interfaces';

export default class Database {
    getData = async (endpoint: string): Promise<ICar[]> => {
        const response = await fetch(`http://localhost:3000/${endpoint}`);
        const res = await response.json();
        return res;
    };

    createCar = async (name: string, color: string) => {
        const response = await fetch('http://localhost:3000/garage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                color,
            }),
        });
        const res = await response.json();
        return res;
    };
}
