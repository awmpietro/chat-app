export {};
const amqp = require('amqplib/callback_api');

class Mq {
  private amqpConn: any = null;
  private pubChannel: any = null;
  private offlinePubQueue: any = [];

  constructor() {
    this.start();
  }

  start = () => {
    amqp.connect(
      'amqp://localhost:5762' + '?heartbeat=60',
      (err: Error, conn: any) => {
        if (err) {
          console.error('[AMQP]', err.message);
          return setTimeout(this.start, 1000);
        }
        conn.on('error', (err: Error) => {
          if (err.message !== 'Connection closing') {
            console.error('[AMQP] conn error', err.message);
          }
        });
        conn.on('close', () => {
          console.error('[AMQP] reconnecting');
          return setTimeout(this.start, 1000);
        });
        console.log('[AMQP] connected');
        this.amqpConn = conn;
        this.startPublisher();
      },
    );
  };

  startPublisher = () => {
    this.amqpConn.createConfirmChannel((err: Error, ch: any) => {
      if (this.closeOnErr(err)) return;
      ch.on('error', (err: Error) => {
        console.error('[AMQP] channel error', err.message);
      });
      ch.on('close', () => {
        console.log('[AMQP] channel closed');
      });

      this.pubChannel = ch;
      while (true) {
        var [
          exchange,
          routingKey,
          content,
        ] = this.offlinePubQueue.shift();
        this.publish(exchange, routingKey, content);
      }
    });
  };

  closeOnErr = (err: Error) => {
    if (!err) return false;
    console.error('[AMQP] error', err);
    this.amqpConn.close();
    return true;
  };

  publish = (exchange: string, routingKey: string, content: any) => {
    try {
      this.pubChannel.publish(
        exchange,
        routingKey,
        content,
        { persistent: true },
        (err: Error, ok: any) => {
          if (err) {
            console.error('[AMQP] publish', err);
            this.offlinePubQueue.push([
              exchange,
              routingKey,
              content,
            ]);
            this.pubChannel.connection.close();
          }
        },
      );
    } catch (e: any) {
      console.error('[AMQP] publish', e.message);
      this.offlinePubQueue.push([exchange, routingKey, content]);
    }
  };
}

module.exports = Mq;
