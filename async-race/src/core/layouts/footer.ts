// eslint-disable-next-line import/no-unresolved, import/extensions
import Component from '../templates/component';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { Links } from '../types/enum';

const links = [
    {
        text: '2024 pdasya',
        link: Links.author,
    },
    {
        text: '<img class="school__logo" src="https://rs.school/images/rs_school_js.svg" alt="rs_school_js" id="rs-school" />',
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
