import React, { useEffect, useState } from 'react';
import './App.css';
import Installer from './Installer.js';
import ZoomApp from './ZoomApp.js';
import appFetch from './helpers/fetch.js';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isZoom, setIsZoom] = useState(false);

    const getContext = async () => {
        const res = await appFetch('/api/context');
        const data = await res.json();
        setIsZoom(data.isZoom);
        setIsLoading(false);
    };

    useEffect(() => {
        getContext();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isZoom ? (
                        <ZoomApp />
                    ) : (
                        <Installer />
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;
