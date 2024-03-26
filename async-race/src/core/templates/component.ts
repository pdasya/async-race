export default class Component {
    container: HTMLElement;

    constructor(tagName: string, className: string) {
        this.container = document.createElement('div');
        this.container.className = className;
    }

    appendContent(content: HTMLElement) {
        this.container.append(content);
    }

    appendTextContent(text: string) {
        this.container.innerText = text;
    }

    render() {
        return this.container;
    }
}
