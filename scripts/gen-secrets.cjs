const envsub = require('envsub')
const crypto = require('crypto')
const fs = require('fs')

const {name} = require('../package.json')

const outputFile = './server/.env';
const templateFile = `${outputFile}.sample`;

const options = {
    protect: true,
    envs: [
        {
            name: '_SESSION_SECRET',
            value: crypto.randomBytes(32).toString('hex'),
        },
        {
            name: '_WEBHOOK_SECRET',
            value: crypto.randomBytes(32).toString('hex'),
        },
        {
            name: '_APP_NAME',
            value: name,
        },
    ],
};

if (!fs.existsSync(outputFile))
    envsub({ templateFile, outputFile, options }).catch((e) =>
        console.error(e)
    );
