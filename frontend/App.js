import React, { useEffect, useState } from 'react';
import './App.css';
import appFetch from './helpers/fetch.js';
import Installer from './components/Installer/Installer.js';
import ZoomApp from './components/ZoomApp/ZoomApp.js';

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

    if (isLoading) {
        return (
            <div className="App">
                <p className="App-loader">Loading...</p>
            </div>
        );
    }

    return (
        <div className="App">
            <div>{isZoom ? <ZoomApp /> : <Installer />}</div>
        </div>
    );
}

export default App;
