import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './css/responsive.css';
import './css/sideNav.css';
import './css/style.css';
import './css/fontawesome.css';
import './css/card.css';
import './css/globals.css';
import './css/animate.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

reportWebVitals();
