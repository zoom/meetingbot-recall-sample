import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter
import './ZoomApp.css';
import zoomSdk from '@zoom/appssdk';
import InMeeting from '../InMeeting/InMeeting.js';
import Fallback from '../Fallback/Fallback.js';
import Home from '../Calendar/Home.jsx';

function ZoomApp() {
    const [zoomContext, setZoomContext] = useState(null);

    const loadContext = async () => {
        let res = await zoomSdk.getRunningContext();
        setZoomContext(res.context);
    };

    useEffect(() => {
        loadContext();
    }, []);

    if (!zoomContext) {
        return (
            <div className="ZoomApp">
                <p className="ZoomApp-loader">Loading...</p>
            </div>
        );
    }

    // @see https://appssdk.zoom.us/types/ZoomSdkTypes.RunningContext.html
    const components = {
        inMeeting: InMeeting,
    };

    const Component = components[zoomContext];

    return (
        <div className="ZoomApp">
            <Router>
                <Routes>
                    <Route
                        path="/home"
                        element={Component ? <Component /> : <Fallback />}
                    />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
}

export default ZoomApp;
