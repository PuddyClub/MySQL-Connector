
module.exports = async function (db, tiny_search) {

    // Validate Database
    if (tiny_search.database && typeof tiny_search.database.name === "string" && typeof tiny_search.database.timeVar === "string" && typeof tiny_search.database.positionVar === "string") {

        // Prepare Tiny Search
        if (tiny_search.where) {
            tiny_search.where += ' AND ';
        }

        tiny_search.params.push(tiny_search.position);

        // Select Direction
        let tiny_direction = '';
        let tiny_order = '';
        if (tiny_search.direction_r) {
            tiny_direction = '<';
            tiny_order = `${tiny_search.database.name}.${tiny_search.database.timeVar} DESC`;
        }

        else {
            tiny_direction = '>';
            tiny_order = `${tiny_search.database.name}.${tiny_search.database.timeVar}`;
        }

        // Select Config
        const existData = await db.query(`SELECT ${tiny_search.select} FROM ${tiny_search.from}
                WHERE ${tiny_search.where}${tiny_search.database.name}.${tiny_search.database.positionVar} ${tiny_direction} ? ORDER BY ${tiny_order} LIMIT 1`, tiny_search.params);

        // Exist Data
        if (existData.length > 0) {
            return existData[0];
        } else {

            // Fix Where
            if (tiny_search.where) {
                tiny_search.where = 'WHERE ' + tiny_search.where.substring(0, tiny_search.where.length - 5);
            }

            // Select Config
            const existData2 = await db.query(`SELECT ${tiny_search.select} FROM ${tiny_search.from}
                    ${tiny_search.where} ORDER BY ${tiny_order} LIMIT 1`, tiny_search.params);

            // Exist Data
            if (existData2.length > 0) {
                return existData2[0];
            } else {
                return null;
            }

        }

    }

    // Nope
    else {
        return null;
    }

};