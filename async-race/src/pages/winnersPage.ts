import Page from '@core/templates/page';
import Winners from '@/core/components/winners';

export default class WinnersPage extends Page {
    async getWinnersPageContainer(): Promise<HTMLElement> {
        const winners = new Winners('div', 'winners');
        this.container.append(await winners.renderWinners());
        return this.container;
    }
}
