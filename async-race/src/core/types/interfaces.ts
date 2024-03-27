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
