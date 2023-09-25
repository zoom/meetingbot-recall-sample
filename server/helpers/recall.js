import fetch from 'node-fetch';
import { zoomApp } from '../config.js';
import _ from 'lodash';

export async function recallFetch(path, options) {
    const res = await fetch(
        `https://api.recall.ai${path}`,
        _.defaultsDeep(
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Token ${zoomApp.recallApiToken}`,
                },
            },
            options
        )
    );

    if (res.status > 299) {
        console.error(
            `Recall API returned ${res.url}: ${res.status}`,
            await res.text()
        );
        const e = new Error('Recall API Error');
        e.code = 500;
        throw e;
    }

    return await res.json();
}
