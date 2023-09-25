import zoomSdk from '@zoom/appssdk';
import _ from 'lodash';

export default async function appFetch(path, options = {}) {
    const context = window.ZOOM_SDK_CONFIGURED
        ? (await zoomSdk.getAppContext())?.context
        : '';

    return fetch(
        path,
        _.defaultsDeep(
            {
                headers: {
                    'X-Zoom-App-Context': context,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
            options
        )
    );
}
