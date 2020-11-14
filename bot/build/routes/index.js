"use strict";
var axios = require('axios');
var crypto = require('crypto');
var fs = require('fs');
var csv = require('csv-parser');
var getStock = function (req, res) {
    var stock = req.query.stock;
    var url = "https://stooq.com/q/l/?s=" + stock + "&f=sd2t2ohlcv&h&e=csv";
    var results = [];
    axios
        .get(url, {
        method: 'get',
        responseType: 'stream',
    })
        .then(function (r) {
        var fileName = crypto.randomBytes(32).toString('hex');
        r.data.pipe(fs.createWriteStream("./" + fileName + ".csv"));
        fs.createReadStream("./" + fileName + ".csv")
            .pipe(csv())
            .on('data', function (data) { return results.push(data); })
            .on('end', function () {
            if (results[0].Close === 'N/D') {
                return res.json({
                    found: false,
                    stock: 'Stock not found',
                });
            }
            else {
                var msg_1 = stock.toUpperCase() + " quote is $" + results[0].Close + " per share";
                fs.unlink(fileName + ".csv", function (err) {
                    if (err) {
                        res.status(500);
                        res.json(err.message);
                    }
                    return res.json({ found: true, stock: msg_1 });
                });
            }
        });
    })
        .catch(function (err) {
        res.status(500);
        res.json(err.message);
    });
};
module.exports = { getStock: getStock };
