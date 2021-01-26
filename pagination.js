module.exports = {

    // Navigator
    navigator: function (page, total, url = '', extraClass = '', extraClass2 = '') {

        if (url) {
            const params = this.getJsonFromUrl(url);
            if (Object.keys(params).length > 0) {
                if (params.page) {
                    url = url.replace('&page=' + params.page, '').replace('?page=' + params.page, '?').replace('?&', '?');
                    
                    if (Object.keys(params).length === 1) {
                        url += 'page=';
                    } else {
                        url += '&page=';
                    }
                } else {
                    url += '&page=';
                }
            } else {
                url += '?page=';
            }
        }

        // Pagination

        const pagination = [];
        const data = {
            url: url,
            extraClass: extraClass,
            extraClass2: extraClass2
        };

        data.next = false;
        data.previous = false;
        for (let i = page - 1; i > page - 5; i--) {
            if (i > 0) {
                pagination.push(i);
                data.previous = true;
            }
        }
        pagination.reverse();
        pagination.push(page);
        for (let i = page + 1; i < page + 5; i++) {
            if (i <= total) {
                pagination.push(i);
                data.next = true;
            }
        }

        // Build Data and send it
        data.page = page;
        data.pagination = pagination;

        if (pagination.indexOf(1) < 0) {
            data.firstPagination = true;
        } else {
            data.firstPagination = false;
        }
        if (pagination.indexOf(total) < 0) {
            data.lastPagination = true;
        } else {
            data.lastPagination = false;
        }

        data.pages = total;

        return data;

    },

    // Creator
    create: async function (db, data) {

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

        return { count: edit_count, data: edits, pages: pages, page: page, start: start }

    },

    getJsonFromUrl: function (url) {
        if (!url) url = location.href;
        var question = url.indexOf("?");
        var hash = url.indexOf("#");
        if (hash === -1 && question === -1) return {};
        if (hash === -1) hash = url.length;
        var query = question === -1 || hash === question + 1 ? url.substring(hash) :
            url.substring(question + 1, hash);
        var result = {};
        query.split("&").forEach((part) => {
            if (!part) return;
            part = part.split("+").join(" "); // replace every + with space, regexp-free version
            var eq = part.indexOf("=");
            var key = eq > -1 ? part.substr(0, eq) : part;
            var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
            var from = key.indexOf("[");
            if (from === -1) result[decodeURIComponent(key)] = val;
            else {
                var to = key.indexOf("]", from);
                var index = decodeURIComponent(key.substring(from + 1, to));
                key = decodeURIComponent(key.substring(0, from));
                if (!result[key]) result[key] = [];
                if (!index) result[key].push(val);
                else result[key][index] = val;
            }
        });
        return result;
    }

};