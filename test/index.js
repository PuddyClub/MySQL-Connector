// Get MYSQL Database
require('../index').create(require('mysql'), 'default', require('./data/config.json'))

    // Success
    .then(db => {

        // Print
        db.query('SELECT * FROM discord_users')

            // Success
            .then(data => {

                // Print
                console.log(data);

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