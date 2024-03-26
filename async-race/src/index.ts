// eslint-disable-next-line import/no-unresolved
import './index.css';
// eslint-disable-next-line import/no-unresolved, import/extensions
import App from './app/app';

window.onload = () => {
    const app = new App();
    app.runApp();
};
