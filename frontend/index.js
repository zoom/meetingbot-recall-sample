import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import zoomSdk from '@zoom/appssdk';

(async () => {
    try {
        window.ZOOM_SDK_CONFIGURED = false;

        try {
            const configResponse = await zoomSdk.config({
                size: { width: 480, height: 360 },
                capabilities: [
                    /* Add Capabilities Here */
                    'shareApp',
                ],
            });

            console.debug('Zoom JS SDK Configuration', configResponse);
            window.ZOOM_SDK_CONFIGURED = true;
        } catch (e) {
            console.warn('Zoom JS SDK Configuration Error', e);
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } catch (e) {
        console.error(e);
    }
})();
