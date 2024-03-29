import { Endpoints, Defaults, Engine, Pagination, Event } from '@core/types/enum';
import { ICar, IStateCar } from '@core/types/interfaces';
import Component from '@core/templates/component';
import Car from '@core/components/car';
import GeneratorCar from '@core/components/generatorCar';
import TGetCars from '@core/types/types';
import EventObserver from '@core/eventObservers/eventObserver';
import Store from '@core/store/store';
import Database from '@database/database';
import PaginationGenerator from '@supporters/pagination/pagination';

class Garage extends Component {
    data: TGetCars;
    event: EventObserver<unknown>;
    total: string;
    database: Database;
    isClickedRace: boolean;

    constructor(tagName: string, className: string, data: TGetCars) {
        super(tagName, className);
        this.data = data;
        this.total = this.data.total || Defaults.carCount;
        this.event = new EventObserver();
        this.database = new Database();
        this.isClickedRace = false;
    }

    async getGeneratorCars(): Promise<HTMLElement> {
        const generator = new GeneratorCar('div', 'car-generator');
        return generator.getGeneratorCarsContainer();
    }

    generateTitle(total: string): HTMLHeadingElement {
        const title = document.createElement('h1');
        title.classList.add('garage__title');
        const allCars = total || this.total;
        title.innerHTML = `Garage (${allCars})`;
        return title;
    }

    generatePageTitle(): HTMLHeadingElement {
        const title = document.createElement('h2');
        title.classList.add('garage__page-title');
        const currentPage = sessionStorage.getItem('currentPage') ?? Defaults.defaultPage;
        title.innerHTML = `Page #${currentPage}`;
        return title;
    }

    getCar(data: TGetCars): HTMLDivElement {
        const cars = document.createElement('div');
        cars.classList.add('cars');

        data.items.map(async (carData) => {
            const car = new Car('div', 'car', this.event);
            if (!carData.id) throw new Error('Car id is not defined');
            const currentCar: HTMLElement = car.renderCar(carData.name, carData.color, Number(carData.id));
            cars.append(currentCar);
            return cars;
        });
        return cars;
    }

    async generatePagination(): Promise<HTMLDivElement> {
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');
        Store.addToStore('pagination', pagination);
        const paginationUl = document.createElement('ul');
        paginationUl.classList.add('pagination__list');

        await this.generatePaginationUl(paginationUl);

        pagination.append(paginationUl);
        return pagination;
    }

    async generatePaginationUl(paginationUl: HTMLUListElement): Promise<HTMLUListElement> {
        const currentPage = sessionStorage.getItem('currentPage') ?? Defaults.defaultPage;
        const data = await this.database.getCars(Endpoints.garage, currentPage);

        const pages = Math.ceil(Number(data.total) / 7);
        const pagesArray: (string | number)[] = PaginationGenerator.getRange(currentPage, pages);
        pagesArray.map((pageItem) => {
            const paginationItem = document.createElement('li');
            paginationItem.classList.add('pagination__item');
            paginationItem.textContent = `${pageItem}`;
            const id = Number(paginationItem.textContent);
            paginationItem.id = `${id}`;
            this.toggleActiveClass(paginationItem, id, currentPage);
            this.togglePage(paginationItem);

            return paginationUl.append(paginationItem);
        });
        return paginationUl;
    }

    togglePage(item: HTMLLIElement): void {
        item.addEventListener('click', async () => {
            const currentPageNumber = Number(item.id);
            Store.setCurrentPage(currentPageNumber);

            const event = Store.getFromEvent('event');
            if (event === undefined) throw new Error('Event is undefined');
            sessionStorage.setItem('currentPage', JSON.stringify(currentPageNumber));
            event.notify('update');
        });
    }

    toggleActiveClass = (paginationItem: HTMLLIElement, id: number, currentPage: string): void => {
        if (id === Number(currentPage)) {
            paginationItem.classList.add('pagination__item--active');
        } else {
            paginationItem.classList.remove('pagination__item--active');
        }
        if (paginationItem.textContent === '...') {
            paginationItem.classList.add('pagination__item--disabled');
        } else {
            paginationItem.classList.remove('pagination__item--disabled');
        }
    };

    eventListener(): void {
        Store.addToEvent('event', this.event);
        this.event.subscribe(async (event) => {
            const currentPage = sessionStorage.getItem('currentPage') ?? Defaults.defaultPage;
            const dataCars = await this.database.getCars('garage', currentPage);
            const currentId = Store.getCurrentId();
            switch (event) {
                case 'update':
                    this.rerenderCars(dataCars);
                    await this.rerenderInterface();
                    await this.rerenderPagination();
                    this.toggleUpdateButton('disable');
                    break;
                case 'updateCars':
                    this.rerenderCars(dataCars);
                    await this.rerenderPagination();
                    break;
                case 'updateInput':
                    await this.rerenderInterface();
                    this.toggleUpdateButton('enable');
                    break;
                case 'race':
                    this.isClickedRace = true;
                    this.toggleRaceResetButtons('all');
                    await this.raceAllCar(dataCars.items);
                    break;
                case 'reset':
                    this.isClickedRace = false;
                    await this.resetAllCars(dataCars.items);
                    break;
                case 'start':
                    await this.startDrive(currentId, await this.database.startEngine(currentId, Engine.start));
                    break;
                case 'stop':
                    await this.resetCarOnStartPosition(Number(this.getElement(`carState${currentId}`).id), currentId);
                    break;
                default:
            }
        });
    }

    toggleUpdateButton(variant: string) {
        const update = Store.getFromStore('updateInterface');
        if (!update || !(update instanceof HTMLElement)) throw new Error('Update input is not HTMLElement');
        if (variant === 'enable') {
            update.classList.remove('car-generator__wrapper--disabled');
        }
        if (variant === 'disable') {
            update.classList.add('car-generator__wrapper--disabled');
            this.clearInputsInUpdate();
        }
    }

    togglePaginationButtons(variant: string) {
        const pagination = Store.getFromStore('pagination');
        if (!pagination || !(pagination instanceof HTMLElement)) throw new Error('Pagination is not HTMLElement');
        if (variant === 'enable') {
            pagination.classList.remove('pagination--disabled');
        }
        if (variant === 'disable') {
            pagination.classList.add('pagination--disabled');
        }
    }

    toggleAllButtons(variant: string, id: string) {
        if (variant === 'enable') {
            this.toggleCarButtons(id, 'stop');
            this.togglePaginationButtons('enable');
        } else {
            this.toggleCarButtons(id, 'start');
            this.toggleUpdateButton('disable');
            this.togglePaginationButtons('disable');
        }
    }

    toggleCarButtons(id: string, variant: string): void {
        const select = this.getElement(`carSelect${id}`);
        const remove = this.getElement(`carRemove${id}`);
        const carStopButton = this.getElement(`carStop${id}`);
        const carStartButton = this.getElement(`carStart${id}`);
        if (!(carStopButton instanceof HTMLButtonElement)) throw new Error('CarStopButton is not HTMLButtonElement');
        if (!(carStartButton instanceof HTMLButtonElement)) throw new Error('CarStartButton is not HTMLButtonElement');
        if (!(select instanceof HTMLButtonElement)) throw new Error('SelectButton is not HTMLButtonElement');
        if (!(remove instanceof HTMLButtonElement)) throw new Error('RemoveButton is not HTMLButtonElement');
    
        if (variant === 'start') {
          carStopButton.classList.remove('car__button--disabled');
          carStartButton.classList.add('car__button--disabled');
          select.classList.add('car__button--disabled');
          remove.classList.add('car__button--disabled');
        } else {
          carStopButton.classList.add('car__button--disabled');
          carStartButton.classList.remove('car__button--disabled');
          select.classList.remove('car__button--disabled');
          remove.classList.remove('car__button--disabled');
        }
      }

      toggleCreateButton(variant: string) {
        const create = Store.getFromStore('createInterface');
        if (!create || !(create instanceof HTMLElement)) throw new Error('Create input is not HTMLElement');
        if (variant === 'enable') {
          create.classList.remove('car-generator__wrapper--disabled');
        }
        if (variant === 'disable') {
          create.classList.add('car-generator__wrapper--disabled');
        }
      }

    async raceAllCar(cars: ICar[]) {
        let isNotFinished = true;
        await Promise.all(
            cars.map(async (car) => {
                if (car.id === undefined) throw new Error('Car id is not defined');
                this.toggleCarButtons(car.id, 'start');
                const carState = await this.database.startEngine(car.id, Engine.start);
                const state = await this.startDrive(car.id, carState);

                if (state?.finish && isNotFinished) {
                    this.generateModal(car.name, state?.time);
                    isNotFinished = false;
                    const time = Number((state.time / 1000).toFixed(2));
                    const curCar = await this.database.getWinner(car.id);
                    if (curCar.id) {
                        if (!curCar.wins) throw new Error('Car wins is not defined');
                        if (!curCar.time) throw new Error('Car time is not defined');
                        const winsCount = curCar.wins + 1;
                        const lessesTime = curCar.time > time ? time : curCar.time;
                        await this.database.updateWinner(curCar.id, { wins: winsCount, time: lessesTime });
                    } else {
                        await this.database.createWinner(Number(car.id), 1, time);
                    }
                }
                return false;
            })
        );

        this.isClickedRace = false;
        this.togglePaginationButtons('enable');
    }

    async resetAllCars(cars: ICar[]): Promise<PromiseSettledResult<void>[]> {
        const res = await Promise.allSettled(
          cars.map(async (car) => {
            if (car.id === undefined) throw new Error('Car id is not defined');
            const requestId = this.getElement(`carState${car.id}`);
            await this.resetCarOnStartPosition(Number(requestId.id), car.id);
          })
        );
        this.toggleRaceResetButtons('enable');
        return res;
      }

      toggleRaceResetButtons(variant: string) {
        const race = Store.getFromStore('race');
        const reset = Store.getFromStore('reset');
        const generateCars = Store.getFromStore('generateCars');
        if (
          !(race instanceof HTMLButtonElement) ||
          !(reset instanceof HTMLButtonElement) ||
          !(generateCars instanceof HTMLButtonElement)
        ) {
          throw new Error('Reset or GenerateCars is not HTMLButtonElement');
        }
        if (variant === 'disable') {
          race.classList.add('car-generator__button--disabled');
          reset.classList.remove('car-generator__button--disabled');
          generateCars.classList.add('car-generator__button--disabled');
        }
        if (variant === 'all') {
          race.classList.add('car-generator__button--disabled');
          reset.classList.add('car-generator__button--disabled');
          generateCars.classList.add('car-generator__button--disabled');
        }
        if (variant === 'enable') {
          race.classList.remove('car-generator__button--disabled');
          reset.classList.add('car-generator__button--disabled');
          generateCars.classList.remove('car-generator__button--disabled');
        }
      }

    generateModal(carName: string, time: number): void {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const timeSecond = Number((time / 1000).toFixed(2));
        const textContent = `${carName} winning, with ${timeSecond} seconds`;
        modal.textContent = textContent;
        document.body.append(modal);
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    async resetCarOnStartPosition(requestId: number, id: string) {
        const carModel = this.getElement(`carModel${id}`);
        if (!(carModel instanceof HTMLElement)) throw new Error('CarModel is not HTMLDivElement');
        carModel.style.transform = 'translate(0px)';
        cancelAnimationFrame(requestId);
        await this.database.startEngine(id, Engine.stop);
        this.toggleAllButtons('enable', id);
        this.toggleRaceResetButtons('enable');
    }

    getElement(key: string) {
        const value = Store.getFromStore(key);
        if (!value) throw new Error(`${key} is undefined`);
        return value;
    }

    async startDrive(id: string, carState: { velocity: number; distance: number }): Promise<IStateCar> {
        this.toggleAllButtons('disable', id);
        this.toggleRaceResetButtons('all');
        const { velocity, distance } = carState;
        const carModel = this.getElement(`carModel${id}`);
        const carFinishLine = this.getElement(`carFinishLine${id}`);
        if (!(carModel instanceof HTMLDivElement)) throw new Error('CarModel is not HTMLDivElement');
        if (!(carFinishLine instanceof HTMLImageElement)) throw new Error('CarFinishLine is not HTMLDivElement');
        const time = distance / velocity;
        const distanceWindow = this.getDistanceBetweenElements(carModel, carFinishLine);
        const res = this.animationCar(carModel, distanceWindow, time);
        Store.addToStore(`carState${id}`, res);
        await this.database.switchCarEngine(id, Engine.drive).then((response) => {
            if (response.status !== 200) {
                cancelAnimationFrame(res.id);
            }
            return response;
        });
        if (!this.isClickedRace) {
            this.togglePaginationButtons('enable');
        }
        this.toggleRaceResetButtons('disable');
        return res;
    }

    getDistanceBetweenElements = (element1: HTMLElement, element2: HTMLElement): number => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return Math.abs(rect1.left - rect2.left) + 20;
    };

    animationCar(car: HTMLElement, distance: number, animationTime: number) {
        let start: null | number = null;

        const res: IStateCar = {
            id: 0,
            time: 0,
        };
        function step(timeStep: number) {
            if (!start) start = timeStep;
            const time = timeStep - start;
            const passed = Math.round(time * (distance / animationTime));
            const currentCar = car;
            currentCar.style.transform = `translate(${Math.min(passed, distance)}px)`;
            res.distance = passed;
            if (passed < distance) {
                res.id = requestAnimationFrame(step);
            } else {
                res.finish = true;
            }
            res.time = time;
        }

        res.finish = false;
        res.id = requestAnimationFrame(step);
        return res;
    }

    rerenderCars(carsData: TGetCars) {
        const containerCar = Store.getFromStore('containerCar');
        if (!containerCar || !(containerCar instanceof HTMLDivElement)) {
            throw new Error('containerCar is not HTMLDivElement');
        }
        containerCar.innerHTML = '';
        const title = this.generateTitle(carsData.total || this.total);
        const pageTitle = this.generatePageTitle();
        const cars = this.getCar(carsData);

        containerCar.append(title, pageTitle, cars);
    }

    async rerenderInterface(): Promise<void> {
        const generatorCar = Store.getFromStore('generatorCar');
        if (!generatorCar || !(generatorCar instanceof HTMLDivElement)) {
            throw new Error('Cars container is not HTMLDivElement');
        }
        generatorCar.innerHTML = '';
        generatorCar.append(await this.getGeneratorCars());
        await this.updateInputs();
    }

    async updateInputs() {
        const carBefore = Store.getFromStore('car');
        const id = carBefore?.id || Defaults.defaultPage;
        const updateTitle = Store.getFromStore('updateTitle');
        const updateColor = Store.getFromStore('updateColor');
        if (!updateTitle || !(updateTitle instanceof HTMLInputElement))
          throw new Error('UpdateTitle is not HTMLDivElement');
        if (!updateColor || !(updateColor instanceof HTMLInputElement))
          throw new Error('UpdateColor is not HTMLDivElement');
    
        const currentPage = sessionStorage.getItem(`${Pagination.garage}currentPage`) ?? Defaults.defaultPage;
        const cars = await this.database.getCars(Endpoints.garage, currentPage);
        cars.items.forEach((car) => {
          if (car.id === id) {
            const valueTitle = car.name ?? '';
            const valueColor = car.color ?? '#000000';
            updateColor.value = valueColor;
            updateTitle.value = valueTitle;
            sessionStorage.setItem(`${Pagination.garage}updateTitle`, updateTitle.value);
            sessionStorage.setItem(`${Pagination.garage}updateColor`, updateColor.value);
    
            Store.addToStore('car', car);
          }
        });
      }

    async rerenderPagination(): Promise<void> {
        const pagination = Store.getFromStore('pagination');
        if (!pagination || !(pagination instanceof HTMLDivElement)) {
            throw new Error('Pagination container is not HTMLDivElement');
        }
        pagination.innerHTML = '';
        const paginationUl = document.createElement('ul');
        paginationUl.classList.add('pagination__list');

        await this.generatePaginationUl(paginationUl);

        pagination.append(paginationUl);
    }

    async appendAll(carsData: TGetCars, total: string) {
        const containerCar = document.createElement('div');
        containerCar.classList.add('garage');
        const generatorCar = document.createElement('div');
        generatorCar.classList.add('car-generator');

        const title = this.generateTitle(total);
        const pageTitle = this.generatePageTitle();
        const cars = this.getCar(carsData);

        containerCar.append(title, pageTitle, cars);
        generatorCar.append(await this.getGeneratorCars());

        this.container.append(generatorCar, containerCar, await this.generatePagination());
        return {
            generatorCar,
            containerCar,
        };
    }

    clearInputsInUpdate() {
        const title = Store.getFromStore('updateTitle');
        const color = Store.getFromStore('updateColor');

        if (!title || !(title instanceof HTMLInputElement)) throw new Error('Title input is not HTMLInputElement');
        if (!color || !(color instanceof HTMLInputElement)) throw new Error('Color input is not HTMLInputElement');

        title.value = '';
        color.value = '#000000';
    }

    async renderGarage(): Promise<HTMLElement> {
        this.eventListener();
        const data = await this.appendAll(this.data, this.total);
        const { containerCar, generatorCar } = data;
        Store.addToStore('containerCar', containerCar);
        Store.addToStore('generatorCar', generatorCar);
        this.toggleUpdateButton('disable');
        return this.container;
    }
}
export default Garage;
