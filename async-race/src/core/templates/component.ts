import TGetCars from '@core/types/types';
import PaginationGenerator from '@supporters/pagination/pagination';
import { Defaults, Endpoints, Event, Pagination } from '@core/types/enum';
import Store from '@core/store/store';
import Database from '@/database/database';
import { IPaginationGenerator } from '@core/types/interfaces';

export default class Component {
    protected container: HTMLElement;

    constructor(tagName: string, className: string) {
        this.container = document.createElement(tagName);
        this.container.className = className;
    }

    appendContent(content: HTMLElement) {
        this.container.append(content);
    }

    appendTextContent(text: string) {
        this.container.innerText = text;
    }

    async generatePagination(name: string, maxPage: number = 7): Promise<HTMLDivElement> {
        const pagination = document.createElement('div');
        pagination.classList.add('pagination');
        Store.addToStore(name, pagination);
        const paginationUl = document.createElement('ul');
        paginationUl.classList.add('pagination__list');
    
        await this.generatePaginationUl(paginationUl, name, maxPage);
    
        pagination.append(paginationUl);
        return pagination;
      }
      async generatePaginationUl(
        paginationUl: HTMLUListElement,
        name: string,
        maxPage: number = 7
      ): Promise<HTMLUListElement> {
        const currentPageStr = sessionStorage.getItem(`${name}currentPage`) ?? Defaults.defaultPage;
        const currentPage = Number(currentPageStr);
        const db = new Database();
        let data: TGetCars | null = null;
        if (maxPage === 7) {
          data = await db.getCars(Endpoints.garage, currentPage);
        } else {
          data = await db.getWinners(currentPage);
        }
        if (!data) throw new Error('Data is undefined');
        const pages = Math.ceil(Number(data.total) / maxPage);
        const pagination: IPaginationGenerator = new PaginationGenerator(currentPage, pages);
        const pagesArray: (string | number)[] = pagination.generate();
    
        pagesArray.map((pageItem) => {
          const paginationItem = document.createElement('li');
          paginationItem.classList.add('pagination__item');
          paginationItem.textContent = `${pageItem}`;
          const id = Number(paginationItem.textContent);
          paginationItem.id = `${id}`;
    
          this.toggleActiveClass(paginationItem, id, currentPage.toString());
          this.togglePage(paginationItem, name);
    
          return paginationUl.append(paginationItem);
        });
        return paginationUl;
      }
      togglePage(item: HTMLLIElement, name: string): void {
        item.addEventListener('click', async () => {
          const currentPageNumber = Number(item.id);
    
          const event = name === Pagination.winners ? Store.getFromEvent('eventWinners') : Store.getFromEvent('event');
          if (event === undefined) throw new Error('Event is undefined');
          sessionStorage.setItem(`${name}currentPage`, JSON.stringify(currentPageNumber));
          event.notify(Event.update);
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

    getContainer() {
        return this.container;
    }
}
