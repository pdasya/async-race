// eslint-disable-next-line import/no-unresolved, import/extensions
import Page from '@core/templates/page';

export default class Winners extends Page {
    static TextObject: {
        Title: 'Winners Page';
    };

    async getWinnersPageContainer(): Promise<HTMLElement> {
        const title = this.createHeaderTitle(Winners.TextObject.Title);
        this.container.append(title);
        return this.container;
    }
}
