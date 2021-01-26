module.exports = function (database, login) {

    // Validator
    if (typeof database === "string" && require('@tinypudding/puddy-lib/get/objType')(login, 'object')) {

        // Result
        const result = require('clone')(login);
        result.database = database;
        return result;

    }

    // Nope
    else {
        return null;
    }

};