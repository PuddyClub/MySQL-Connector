module.exports = async function (db, data) {

    // Create Where
    if (data.where) {
        data.where = ' WHERE ' + data.where;
    } else {
        data.where = '';
    }

    // Values
    let start = 0;
    let page;
    let pages;
    let edit_count;

    if (typeof data.page === "number") {

        // Get Count
        if (!data.count) {
            edit_count = await db.query(`SELECT COUNT(*) FROM ${data.from}${data.where}`, data.params);
            edit_count = edit_count[0]['COUNT(*)'];
        } else {
            edit_count = data.count;
        }

        // Prepare Numbers
        pages = Math.ceil(edit_count / data.limit);

        // Default
        page = data.page;

        // Is Last
        if (page === "last") {
            page = pages;
        }

        // is NaN
        else if (isNaN(page)) {
            page = 1;
        }

        // Bigger
        else if (page > pages) {
            page = pages;
        }

        // Smaller
        else if (page < 1) {
            page = 1;
        }

        // Offset
        if (page) {
            start = Number(page - 1) * data.limit;
        } else {
            start = 0;
            page = 1;
        }

    }

    if (!data.select) {
        data.select = '*';
    }

    // Count Rows
    let count_rows = {
        select: '',
        from: ''
    };

    if (data.count_rows) {
        count_rows = {
            select: `(@row_number:=@row_number + 1) AS row_num, `,
            from: `(SELECT @row_number:=${start}) AS row_number, `
        };
    }

    // Edits
    let tiny_query = `SELECT ${count_rows.select}${data.select} FROM ${count_rows.from}${data.from}${data.where} ORDER BY ${data.order}`;
    if (typeof data.limit === "number") {
        tiny_query += ` LIMIT ${data.limit}`;
    }
    if (typeof data.page === "number") {
        tiny_query += ` OFFSET ${start}`;
    }

    let edits = await db.query(tiny_query, data.params);

    // Complete
    return { count: edit_count, data: edits, pages: pages, page: page, start: start };

};