import { URL } from 'url';
import { redirectUri } from './config.js';

const redirectHost = new URL(redirectUri).host;

/*  Middleware */
export default {
    frameguard: {
        action: 'sameorigin',
    },
    hsts: {
        maxAge: 31536000,
    },
    referrerPolicy: 'same-origin',
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            'default-src': "'self'",
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: [
                "'self'",
                'https://appssdk.zoom.us/sdk.min.js',
                "'unsafe-eval'",
            ],
            imgSrc: ["'self'", `https://${redirectHost}`],
            'connect-src': "'self'",
            'base-uri': "'self'",
            'form-action': "'self'",
            'manifest-src': "'self'",
        },
    },
};
