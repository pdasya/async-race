export default class Page {
    container: HTMLElement;

    constructor(id: string) {
        this.container = document.createElement('div');
        this.container.className = 'main-container';
        this.container.id = id;
    }

    createHeaderTitle(text: string) {
        const headerTitle = document.createElement('h1');
        headerTitle.innerText = text;
        return headerTitle;
    }

    async getContainer(): Promise<HTMLElement> {
        return this.container;
    }
}
