// eslint-disable-next-line import/no-unresolved, import/extensions
import Page from '@core/templates/page';

export default class Garage extends Page {
    static TextObject: {
        Title: 'Garage Page';
    };

    async getGaragePageContainer(): Promise<HTMLElement> {
        const title = this.createHeaderTitle(Garage.TextObject.Title);
        this.container.append(title);
        return this.container;
    }
}
