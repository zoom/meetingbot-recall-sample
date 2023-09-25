import React from 'react';
import './Installer.css';

function Installer() {
    return (
        <div className="Installer">
            <div className="Installer-body">
                <p>
                    You&apos;re viewing your Zoom App through the browser.&nbsp;{' '}
                    <br />
                    <a className="Installer-link" href="/install">
                        Click Here
                    </a>
                    &nbsp;to install your app in Zoom.
                </p>
            </div>
        </div>
    );
}

export default Installer;
