// eslint-disable-next-line import/no-unresolved
import './style.css';
// eslint-disable-next-line import/no-unresolved, import/extensions
import App from './app/app';

window.onload = () => {
    const app = new App();
    app.runApp();
};
