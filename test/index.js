// Get MYSQL Database
require('../index').create(require('mysql'), 'default', require('./data/config.json'))

    // Success
    .then(db => {

        // Print
        console.log(db);

        // Complete
        return;

    })

    // Fail
    .catch(err => {

        // Print
        console.error(err);

        // Complete
        return;

    });

// Random Interval
setInterval(function () { }, 1000);