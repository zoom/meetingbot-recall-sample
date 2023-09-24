import concurrently from 'concurrently';

// Configure our server environment variables for darwin/linux and win32
let command = `nodemon app.js`;

if (process.platform === 'win32')
    command = `set "DEBUG=zoomapps*" & ${command}`;
else command = `DEBUG="zoomapps*" ${command}`;

const { result } = concurrently([
    {
        command,
        name: 'dev-server',
        prefixColor: 'inverse.cyan',
    },
    {
        command: ``,
        name: 'dev-app',
        prefixColor: 'inverse.yellow',
    },
]);

result.catch((e) => console.error(e));
