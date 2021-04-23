<div align="center">
<p>
    <a href="https://discord.gg/TgHdvJd"><img src="https://img.shields.io/discord/413193536188579841?color=7289da&logo=discord&logoColor=white" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/@tinypudding/mysql-connector"><img src="https://img.shields.io/npm/v/@tinypudding/mysql-connector.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/@tinypudding/mysql-connector"><img src="https://img.shields.io/npm/dt/@tinypudding/mysql-connector.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://www.patreon.com/JasminDreasond"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/@tinypudding/mysql-connector/"><img src="https://nodei.co/npm/@tinypudding/mysql-connector.png?downloads=true&stars=true" alt="npm installnfo" /></a>
</p>
</div>

# MySQL-Connector
Script to connect to MySQL databases with Google Cloud Proxy support.

## Example


### connect.js (Module)
You will use this module to create a totally easy to use method to create a connection to your database. You just need to insert your database name into the method. Totally simple and easy!
```js
module.exports = function (database = 'main', insertSSL = true) {
    return new Promise(async function (resolve, reject) {

        // Modules
        const mysql = require('@tinypudding/mysql-connector/create');
        const getMySQL = require('./get');

        // Single Database
        if (typeof database === "string") {

            // Get MySQL Connection
            mysql(require('mysql'), 'firebase', getMySQL(database, insertSSL)).then(resolve).catch(reject);

        }

        // Nope
        else {

            // Prepapre Module
            const sameUser = require('@tinypudding/mysql-connector/sameUser');

            // Prepare Keys
            let key;
            const keys = [];

            // Get Keys
            for (const item in database) {

                if (Number(item) > 0) {
                    keys.push(sameUser(database[item], key));
                } else { key = getMySQL(database[item], insertSSL); keys.push(key); }

            }

            // start Connection
            mysql(require('mysql'), 'firebase', keys).then(resolve).catch(reject);

        }

        // Complete
        return;

    });
};
```

### get.js (Module)
This module will get the json from your database settings.
```js
module.exports = function (database = 'main', insertSSL = true) {

    // Get Key
    const key = require('clone')(require('./keys.json'));

    // Insert Database Value
    key.data.database = database;

    // Insert SSL
    if(insertSSL) {key.data.ssl = require('./getSSL')();}

    // Complete
    return key;

};
```

### getSSL.js (Module)
If you are using SSL. This file will help you to get your SSL data.
```js
module.exports = function (readType) {

    // Prepare FS
    const fs = require('fs');
    const path = require('path');

    // Prepare Items
    const result = {
        ca: fs.readFileSync(path.join(__dirname, '/server-ca.pem'), readType),
        cert: fs.readFileSync(path.join(__dirname, '/client-cert.pem'), readType),
        key: fs.readFileSync(path.join(__dirname, '/client-key.pem'), readType),
        rejectUnauthorized: true
    };

    // Send Result
    return result;

};
```

### keys.json (JSON)
This is the file that will contain all the default connection settings for your database.
```json
{
    "google_cloud": {
        "socketPath": "/cloudsql/{project-name}:{region}:{database-server-id}"
    },
    "default": {
        "host": "public-database-server-ip",
        "port": 3306
    },
    "data": {
        "database": "server-database-name",
        "user": "root",
        "password": "example123"
    }
}
```