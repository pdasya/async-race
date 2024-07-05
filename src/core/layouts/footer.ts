import Component from '@core/templates/component';
import { Links } from '@core/types/enum';

const links = [
    {
        text: '2024 pdasya',
        link: Links.author,
    },
    {
        text: 'RS School',
        link: Links.course,
    },
];

export default class Footer extends Component {
    getFooterContent() {
        const footerContent = document.createElement('ul');
        footerContent.classList.add('footer__contacts');
        const contactsItem = document.createElement('li');
        contactsItem.classList.add('footer__contacts-item');

        footerContent.append(contactsItem);
        this.container.append(footerContent);
        this.enableEventListeners(contactsItem);
    }

    enableEventListeners(contactsItem: HTMLElement) {
        links.forEach((item) => {
            const contactLink = document.createElement('a');
            contactLink.addEventListener('click', () => window.open(item.link));
            contactLink.innerHTML = item.text;
            contactsItem.append(contactLink);
        });
    }

    getFooterContainer() {
        this.getFooterContent();
        return this.container;
    }
}
