import Component from '@core/templates/component';
import Database from '@database/database';
import Store from '@core/store/store';
import { Endpoints, Defaults, Pagination, Event } from '@core/types/enum';
import { ICar } from '@core/types/interfaces';
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
        const database = new Database();

        Store.addToStore('createInterface', create.divInput);
        Store.addToStore('createTitle', create.inputForTitle);
        Store.addToStore('createColor', create.inputForColor);
        create.inputForTitle.addEventListener('input', () => {
        sessionStorage.setItem(`${Pagination.garage}createTitle`, create.inputForTitle.value);
        });
        create.inputForColor.addEventListener('input', () => {
        sessionStorage.setItem(`${Pagination.garage}createColor`, create.inputForColor.value);
        });
        create.inputForTitle.value = sessionStorage.getItem(`${Pagination.garage}createTitle`) ?? '';
        create.inputForColor.value = sessionStorage.getItem(`${Pagination.garage}createColor`) ?? '';

        const event = Store.getFromEvent('event');
        if (event === undefined) throw new Error('Event is undefined');

        create.button.addEventListener('click', async () => {
            await database.createCar(create.inputForTitle.value, create.inputForColor.value);
            event.notify(Event.update);
        });
        return create.divInput;
    }

    async getUpdateInterface(): Promise<HTMLElement> {
        const update = this.generateGeneratorCars('update');
        Store.addToStore('updateInterface', update.divInput);
        Store.addToStore('updateTitle', update.inputForTitle);
        Store.addToStore('updateColor', update.inputForColor);
        const database = new Database();

        const event = Store.getFromEvent('event');
        if (event === undefined) throw new Error('Event is undefined');

        const carBefore = Store.getFromStore('car');
        const id = carBefore?.id || '1';

        update.button.addEventListener('click', async () => {
            await database.updateCar(update.inputForTitle.value, update.inputForColor.value, id.toString());
            event.notify(Event.update);
        });

        update.inputForTitle.addEventListener('input', () => {
            sessionStorage.setItem(`updateTitle`, update.inputForTitle.value);
          });
          update.inputForColor.addEventListener('input', () => {
            sessionStorage.setItem(`updateColor`, update.inputForColor.value);
          });
          update.inputForTitle.value = sessionStorage.getItem(`updateTitle`) ?? '';
          update.inputForColor.value = sessionStorage.getItem(`updateColor`) ?? '';

        return update.divInput;
    }

    async generateButton(name: string): Promise<HTMLButtonElement> {
        const button = document.createElement('button');
        button.classList.add('car-generator__button');
        button.innerHTML = name;
        return button;
    }

    async generateButtons(): Promise<HTMLElement> {
        const wrapper = document.createElement('div');
        wrapper.classList.add('car-generator__buttons');
        const race = await this.enableListenerAndGenerateButton('race');
        const reset = await this.enableListenerAndGenerateButton('reset');
        reset.classList.add('car-generator__button--disabled');
        const generateCars = this.generateButton('generate cars');
        Store.addToStore('race', race);
        Store.addToStore('reset', reset);
        Store.addToStore('generateCars', await generateCars);
        this.generateRandomCars(await generateCars);
        wrapper.append(race, reset, await generateCars);
        return wrapper;
    }

    async generateRandomCars(button: HTMLButtonElement): Promise<void> {
        const db = new Database();
        const event = Store.getFromEvent('event');
        if (!event) throw new Error('Event is undefined');
        const oneHundredCars: ICar[] = new CarRandomGenerate().generateOneHundredCars();

        button.addEventListener('click', async () => {
            Promise.all(
                oneHundredCars.map(async (car) => {
                    await db.createCar(car.name, car.color);
                })
            )
                .then(() => event.notify(Event.updateCars))
                .catch((error) => error);
        });
    }

    async enableListenerAndGenerateButton(name: string) {
        const element = this.generateButton(name);

        (await element).addEventListener('click', async () => {
            const event = Store.getFromEvent('event');
            if (!event) throw new Error('Event is undefined');
            event.notify(name);
        });

        return element;
    }

    async appendAll() {
        const create = await this.getCreateInterface();
        const update = await this.getUpdateInterface();
        const buttons = await this.generateButtons();
        this.container.append(create, update, buttons);
    }

    getGeneratorCarsContainer() {
        this.appendAll();
        return this.container;
    }
}
