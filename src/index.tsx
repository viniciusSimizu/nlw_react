import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/global.scss';

import './services/firebase';
import {BrowserRouter, HashRouter, Route} from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </BrowserRouter>
);
