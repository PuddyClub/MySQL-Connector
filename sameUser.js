module.exports = function (database, login) {

    // Validator
    const objType = require('@tinypudding/puddy-lib/get/objType');
    if (typeof database === "string" && objType(login, 'object') && objType(login.data, 'object')) {

        // Result
        const result = require('clone')(login);
        result.data.database = database;
        return result;

    }

    // Nope
    else {
        return null;
    }

};