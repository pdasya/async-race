export default class Page {
    container: HTMLElement;

    static TextObject = {};

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.className = 'main-container';
        this.container.id = id;
    }

    createHeaderTitle(text: string) {
        const headerTitle = document.createElement('h1');
        headerTitle.textContent = text;
        return headerTitle;
    }

    getContainer() {
        return this.container;
    }
}
