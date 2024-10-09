import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
// import 'bulma/sass/_index.scss';

const rootDiv = document.getElementById('react-root') as HTMLDivElement;
const reactRoot = createRoot(rootDiv);
reactRoot.render(React.createElement(App));