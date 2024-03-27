/* eslint-disable import/no-unresolved */
import Component from '@core/templates/component';
import DataBase from '@database/database';
import Store from '@core/store/store';
import { Endpoints } from '@core/types/enum';
import { ICar } from '@core/types/interfaces';
// eslint-disable-next-line import/extensions
import CarRandomGenerate from '@/supporters/generateRandomCars/generateRandomCars';

export default class GeneratorCar extends Component {
    protected static cars: HTMLElement[] = [];

    generateGeneratorCars(name: string) {
        const divInput = document.createElement('div');
        const inputForTitle = document.createElement('input');
        const inputForColor = document.createElement('input');
        const button = document.createElement('button');

        divInput.classList.add('car-generator__wrapper');

        inputForTitle.classList.add('car-generator__title');
        inputForTitle.setAttribute('type', 'text');
        inputForTitle.setAttribute('placeholder', 'Title');

        inputForColor.classList.add('car-generator__color');
        inputForColor.setAttribute('type', 'color');

        button.classList.add('car-generator__input-button');
        button.innerHTML = name;

        divInput.append(inputForTitle, inputForColor, button);
        return {
            divInput,
            inputForTitle,
            inputForColor,
            button,
        };
    }

    async getCreateInterface(): Promise<HTMLElement> {
        const create = this.generateGeneratorCars('create');
        const database = new DataBase();

        const event = Store.event.get('event');
        if (event === undefined) throw new Error('Event is undefined');

        create.button.addEventListener('click', async () => {
            await database.createCar(create.inputForTitle.value, create.inputForColor.value);
            event.notify('update');
        });
        return create.divInput;
    }

    async getUpdateInterface(): Promise<HTMLElement> {
        const update = this.generateGeneratorCars('update');
        const database = new DataBase();

        const event = Store.event.get('event');
        if (event === undefined) throw new Error('Event is undefined');

        const carBefore = Store.getFromStore('car');
        const id = carBefore?.id || '1';

        update.button.addEventListener('click', async () => {
            await database.updateCar(update.inputForTitle.value, update.inputForColor.value, id);
            event.notify('update');
        });

        const cars = await database.getCars(Endpoints.garage, 1);

        cars.items.forEach((car) => {
            if (car.id === id) {
                update.inputForTitle.value = car?.name || '';
                update.inputForColor.value = car?.color || '#000000';

                Store.addToStore('car', car);
            }
        });

        return update.divInput;
    }

    generateButton(name: string): HTMLButtonElement {
        const button = document.createElement('button');
        button.classList.add('car-generator__button');
        button.innerHTML = name;
        return button;
    }

    generateButtons(): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.classList.add('car-generator__buttons');
        const race = this.generateButton('race');
        const reset = this.generateButton('reset');
        const generateCars = this.generateButton('generate cars');
        this.generateRandomCars(generateCars);
        wrapper.append(race, reset, generateCars);
        return wrapper;
    }

    async generateRandomCars(button: HTMLButtonElement): Promise<void> {
        const db = new DataBase();
        const event = Store.event.get('event');
        if (!event) throw new Error('Event is undefined');
        const oneHundredCars: ICar[] = new CarRandomGenerate().generateOneHundredCars();

        button.addEventListener('click', async () => {
            Promise.all(
                oneHundredCars.map(async (car) => {
                    await db.createCar(car.name, car.color);
                })
            )
                .then(() => event.notify('updateCars'))
                .catch((error) => error);
        });
    }

    async appendAll() {
        const create = await this.getCreateInterface();
        const update = await this.getUpdateInterface();
        const buttons = this.generateButtons();
        this.container.append(create, update, buttons);
    }

    getGeneratorCarsContainer() {
        this.appendAll();
        return this.container;
    }
}
