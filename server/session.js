import cookieSession from 'cookie-session';
import { zoomApp } from './config.js';

export default cookieSession({
    name: 'session',
    httpOnly: true,
    keys: [zoomApp.sessionSecret],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
});
