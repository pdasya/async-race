import Component from '@core/templates/component';
import { PageIds } from '@core/types/enum';
import Store from '@core/store/store';

const Buttons = [
    {
        id: PageIds.Garage,
        text: 'Garage',
    },
    {
        id: PageIds.Winners,
        text: 'Winners',
    },
];

export default class Header extends Component {
    getNavButtons() {
        const navButtons = document.createElement('div');
        navButtons.classList.add('header__nav');
        this.generateNavButtons(navButtons);
        this.container.append(navButtons);
    }

    generateNavButtons(navButtons: HTMLElement) {
        Buttons.forEach((button) => {
            const navButton = document.createElement('a');
            navButton.classList.add('header__nav-btn');
            navButton.setAttribute('href', `#${button.id}`);
            navButton.setAttribute('id', button.id);
            Store.addToStore(`navButton${button.id}`, navButton);
            navButton.textContent = button.text;
            navButtons.append(navButton);
        });
    }

    getNavContainer() {
        this.getNavButtons();
        return this.container;
    }
}
