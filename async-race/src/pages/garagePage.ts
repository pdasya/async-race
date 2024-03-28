/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Page from '@core/templates/page';
import Database from '@/database/database';
import Garage from '@/core/components/garage';
import { Endpoints } from '@/core/types/enum';

export default class GaragePage extends Page {
    async getCars(): Promise<HTMLElement> {
        const database = new Database();
        const currentPage = sessionStorage.getItem('currentPage') ?? '1';
        const data = await database.getCars(Endpoints.garage, currentPage);
        const cars = new Garage('div', 'garage__wrapper', data);
        const result = await cars.renderGarage();
        return result;
    }

    async getGaragePageContainer(): Promise<HTMLElement> {
        this.container.append(await this.getCars());
        return this.container;
    }
}
