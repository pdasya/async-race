import Page from '@core/templates/page';
import { PageIds, Event } from '@core/types/enum';
import Header from '@core/layouts/header';
import Main from '@core/layouts/main';
import Footer from '@core/layouts/footer';
import GaragePage from '@pages/garagePage';
import WinnersPage from '@pages/winnersPage';
import Store from '@/core/store/store';

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
            page = new GaragePage(idPage);
            App.url = idPage;
        } else if (idPage === PageIds.Winners) {
            page = new WinnersPage(idPage);
            App.url = idPage;
            const event = Store.getFromEvent('event');
            if (!event) throw new Error('Event is undefined');
            if (Store.getIsClickedRace()) {
                event.notify(Event.reset);
            }
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
        window.location.hash = PageIds.Garage;
        App.createNewPage(PageIds.Garage);
    }
}
