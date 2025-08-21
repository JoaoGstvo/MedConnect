import React from 'react';
import ReactDOM from 'react-dom/client';

import Routes from "./routes"

import './index.scss';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

