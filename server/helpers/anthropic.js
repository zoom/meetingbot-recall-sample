import fetch from 'node-fetch';
import { zoomApp } from '../config.js';
import _ from 'lodash';

export async function anthropicFetch(path, options) {
    const res = await fetch(
        `https://api.anthropic.com${path}`,
        _.defaultsDeep(
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Anthropic-Version': '2023-06-01',
                    'X-Api-Key': zoomApp.anthropicApiToken,
                },
            },
            options
        )
    );

    if (res.status > 299) {
        console.error(
            `Anthropic API returned ${res.url}: ${res.status}`,
            await res.text()
        );
        const e = new Error('Anthropic API Error');
        e.code = 500;
        throw e;
    }

    return await res.json();
}
