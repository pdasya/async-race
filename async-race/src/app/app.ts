// eslint-disable-next-line import/no-unresolved, import/extensions
import Page from '@core/templates/page';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { PageIds } from '@core/types/enum';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Header from '@core/layouts/header';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Main from '@core/layouts/main';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Footer from '@core/layouts/footer';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Garage from '@pages/garagePage';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Winners from '@pages/winnersPage';

export default class App {
    private static body: HTMLElement = document.body;

    private static url: string | null = PageIds.Default;

    private static main: Main = new Main('main', 'main');

    private static header: Header = new Header('header', 'header');

    private static footer: Footer = new Footer('footer', 'footer');

    static createNewPage(idPage: string): void {
        if (App.url) App.url = null;
        let page: Page | null = null;

        if (idPage === PageIds.Garage) {
            page = new Garage(idPage);
            App.url = idPage;
        } else if (idPage === PageIds.Winners) {
            page = new Winners(idPage);
            App.url = idPage;
        }

        if (page) {
            (async () => {
                const pageHTML = await page.getContainer();
                App.url = PageIds.Default;
                App.main.refreshMainContainer().append(pageHTML);
            })();
        }
    }

    enableRouteChange(): void {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.createNewPage(hash);
        });
    }

    generatePage(): void {
        const pageWrapper = document.createElement('div');
        pageWrapper.classList.add('page-wrapper');
        pageWrapper.append(App.header.getNavContainer());
        pageWrapper.append(App.main.getMainElement());
        pageWrapper.append(App.footer.getFooterContainer());
        App.body.append(pageWrapper);
    }

    runApp(): void {
        this.generatePage();
        this.enableRouteChange();
        App.createNewPage(PageIds.Garage);
    }
}
