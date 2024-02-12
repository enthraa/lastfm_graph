import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Header from './Header';
import App from './App';
import Bottom from './Bottom';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));
root.render(
  <div>
    <Header />
    <App />
    <Bottom />
  </div>

);

reportWebVitals();