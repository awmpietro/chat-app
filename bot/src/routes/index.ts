const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const csv = require('csv-parser');

const getStock = (req: any, res: any) => {
  const stock = req.query.stock;
  const url = `https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`;
  const results: any = [];
  axios
    .get(url, {
      method: 'get',
      responseType: 'stream',
    })
    .then((r: any) => {
      const fileName = crypto.randomBytes(32).toString('hex');
      r.data.pipe(fs.createWriteStream(`./${fileName}.csv`));
      fs.createReadStream(`./${fileName}.csv`)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => {
          if (results[0].Close === 'N/D') {
            return res.json({
              found: false,
              stock: 'Stock not found',
            });
          } else {
            const msg = `${stock.toUpperCase()} quote is \$${
              results[0].Close
            } per share`;
            fs.unlink(`${fileName}.csv`, (err: Error) => {
              if (err) {
                res.status(500);
                res.json(err.message);
              }
              return res.json({ found: true, stock: msg });
            });
          }
        });
    })
    .catch((err: Error) => {
      res.status(500);
      res.json(err.message);
    });
};

module.exports = { getStock };
