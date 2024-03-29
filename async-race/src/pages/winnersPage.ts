import Database from '@/database/database';
import Page from '@core/templates/page';
import Winners from '@/core/components/winners';
import { Defaults, Pagination, Sort } from '@/core/types/enum';

export default class WinnersPage extends Page {
    async getWinners(): Promise<HTMLElement> {
        const db = new Database();
        const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? Defaults.defaultPage;
        const sort = sessionStorage.getItem('sort') ?? '';
        const orderWins = sessionStorage.getItem('orderWins') ?? Sort.DESC;
        const orderTime = sessionStorage.getItem('orderTime') ?? Sort.DESC;
        if (!sort) throw new Error('Sort is undefined');
        const order = sort === 'wins' ? orderWins : orderTime;
        const data = await db.getWinners(currentPage, sort, order);
        const winners = new Winners('div', 'winners', data);
        const result = await winners.renderWinners();
        return result;
      }

    async getWinnersPageContainer(): Promise<HTMLElement> {
        this.container.append(await this.getWinners());
        return this.container;
    }
}
