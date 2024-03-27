// eslint-disable-next-line import/no-unresolved
import { ICarRandomGenerate, ICar } from '@core/types/interfaces';
import carBrands from './carBrands.json';
import carModels from './carModels.json';

export default class CarRandomGenerate implements ICarRandomGenerate {
    public generateRandomCar = (): string => {
        const randomBrand = Math.floor(Math.random() * carBrands.length);
        const randomModel = Math.floor(Math.random() * carModels.length);
        return `${carBrands[randomBrand]} ${carModels[randomModel]}`;
    };

    public generateRandomColor = (): string => Math.floor(Math.random() * 16777215).toString(16);

    public generateCar = (): ICar => {
        const car = {
            name: this.generateRandomCar(),
            color: `#${this.generateRandomColor()}`,
        };
        return car;
    };

    public generateOneHundredCars = (): ICar[] => {
        const result = [];
        for (let i = 0; i < 100; i += 1) {
            result.push(this.generateCar());
        }
        return result;
    };
}
