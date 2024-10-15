import Settings from './settings.json';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const app = document.getElementById('app') as HTMLDivElement;
const reactRoot = createRoot(app);

// Render with React's strict mode if in debug
if(Settings.debug) {
    reactRoot.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
else {
    reactRoot.render(<App />)
}