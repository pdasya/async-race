// eslint-disable-next-line import/no-unresolved, import/extensions
import Component from '../templates/component';

export default class Main extends Component {
    createMainElement() {
        const main = document.createElement('main');
        main.classList.add('main');
    }

    refreshMainContainer() {
        this.container.innerHTML = '';
        this.createMainElement();
        return this.container;
    }

    getMainElement() {
        this.createMainElement();
        return this.container;
    }
}
