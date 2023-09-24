import http from 'http';
import debug from 'debug';
import { appName } from './config.js';

const dbg = debug(`${appName}:http`);

/**
 * Start the HTTP server
 * @param app - Express app to attach to
 * @param {String|number} port - local TCP port to serve from
 */
export async function start(app, port) {
    // Create HTTP server
    const server = http.createServer(app);

    // let the user know when we're serving
    server.on('listening', () => {
        const addr = server.address();
        const bind =
            typeof addr === 'string'
                ? `pipe ${addr}`
                : `http://localhost:${addr.port}`;
        dbg(`Listening on ${bind}`);
    });

    server.on('error', async (error) => {
        if (error?.syscall !== 'listen') throw error;

        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (error?.code) {
            case 'EACCES':
                throw new Error(`${bind} requires elevated privileges`);
            case 'EADDRINUSE':
                throw new Error(`${bind} is already in use`);
            default:
                throw error;
        }
    });

    // Listen on provided port, on all network interfaces
    return server.listen(port);
}
