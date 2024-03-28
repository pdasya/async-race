/* eslint-disable no-unused-vars */
export interface ICar {
    name: string;
    id?: string;
    color: string;
}

export interface ICarRandomGenerate {
    generateRandomCar: () => string;
    generateRandomColor: () => string;
    generateCar: () => ICar;
    generateOneHundredCars: () => ICar[];
}

export interface IPaginationGenerator {
    getRange(start: number, end: number): number[];
    clamp(number: number, lower: number, upper: number): number;
    generate(): Array<string | number>;
}

export interface IStateCar {
    id: number;
    finish?: boolean | undefined;
    distance?: number | undefined;
    time: number;
}
