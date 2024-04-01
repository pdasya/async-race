import Database from '@/database/database';
import Page from '@core/templates/page';
import Winners from '@/core/components/winners';
import { Defaults, Pagination } from '@/core/types/enum';

class WinnersPage extends Page {
    async getWinners(): Promise<HTMLElement> {
      const db = new Database();
      const currentPage = sessionStorage.getItem(`${Pagination.winners}currentPage`) ?? Defaults.defaultPage;
      const data = await db.getWinners(currentPage);
      const winners = new Winners('div', 'winners', data);
      const result = await winners.renderWinners();
      return result;
    }
    async render(): Promise<HTMLElement> {
      this.container.append(await this.getWinners());
      return this.container;
    }
  }
  
  export default WinnersPage;
