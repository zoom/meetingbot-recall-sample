import { URL } from 'url';

let hasMissing = false;

const validateEnv = (name, val) => {
    if (!val || typeof val !== 'string') {
        console.log(`${name} is required`);
        hasMissing = true;
    }
};

validateEnv('ZM_CLIENT_ID', process.env.ZM_CLIENT_ID);
validateEnv('ZM_CLIENT_SECRET', process.env.ZM_CLIENT_SECRET);
validateEnv('PUBLIC_URL', process.env.PUBLIC_URL);
validateEnv('SESSION_SECRET', process.env.SESSION_SECRET);

if (hasMissing) throw new Error('Missing required .env values...exiting');

try {
    new URL(process.env.PUBLIC_URL);
} catch (e) {
    throw new Error(`Invalid PUBLIC_URL: ${e.message}`);
}

export const zoomApp = {
    host: process.env.ZM_HOST || 'https://zoom.us',
    clientId: process.env.ZM_CLIENT_ID,
    clientSecret: process.env.ZM_CLIENT_SECRET,
    redirectUrl: `${process.env.PUBLIC_URL}/auth`,
    publicUrl: process.env.PUBLIC_URL,
    sessionSecret: process.env.SESSION_SECRET,
    recallApiToken: process.env.RECALL_API_TOKEN,
    anthropicApiToken: process.env.ANTHROPIC_API_TOKEN,
    webhookSecret: process.env.WEBHOOK_SECRET,
};

// Zoom App Info
export const appName = process.env.APP_NAME || 'zoom-app';
export const redirectUri = zoomApp.redirectUrl;

// HTTP
export const port = process.env.PORT || '3000';

// require secrets are explicitly imported
export default {
    appName,
    redirectUri,
    port,
};
