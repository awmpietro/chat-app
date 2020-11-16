const axios = require('axios');
const crypto = require('crypto');
const csv = require('csv-parser');
const { Request, Response } = require('express');
const fs = require('fs');

/*
 * @function: getStock
 * function that handles /get-stock request.
 * @params: req: Request object, res: Response object.
 */
const getStock = async (
  req: typeof Request,
  res: typeof Response,
) => {
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
      const readStream = r.data.pipe(
        fs.createWriteStream(`./temp/${fileName}.csv`),
      );
      readStream.on('finish', () => {
        fs.createReadStream(`./temp/${fileName}.csv`)
          .pipe(csv())
          .on('data', (data: any) => results.push(data))
          .on('end', () => {
            const mq = res.locals.mq;
            if (results[0].Close === 'N/D') {
              // queue the object
              mq.sendToQueue(
                'jobs',
                JSON.stringify({
                  found: false,
                  stock: 'Stock not found',
                }),
              );
            } else {
              const msg = `${stock.toUpperCase()} quote is \$${
                results[0].Close
              } per share`;

              // queue the object
              mq.sendToQueue(
                'jobs',
                JSON.stringify({ found: true, stock: msg }),
              );
              return res.json({ found: true, stock: msg });
            }
          });
      });
    })
    .catch((err: Error) => {
      res.status(500);
      res.json(err.message);
    });
};

export { getStock };
