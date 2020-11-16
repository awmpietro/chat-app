export {};

/*
 * @class: Mq
 * Mq is responsible for managing rabbit mq for the consumer/subscriber.
 */
class Mq {
  /*
   * @method: connect
   * This method returns a connnection to the rabbit mq.
   */
  connect() {
    return require('amqplib')
      .connect(process.env.MESSAGE_QUEUE)
      .then((conn: any) => conn.createChannel());
  }

  /*
   * @method: createQueue
   * This method returns a Promise containing the rabbit mq communication's channel.
   * @params: channel: communication's channel created on connection, queue: queue name for subscribing
   */
  createQueue(channel: any, queue: any) {
    return new Promise((resolve: any, reject: any) => {
      try {
        channel.assertQueue(queue, { durable: true });
        resolve(channel);
      } catch (err) {
        reject(err);
      }
    });
  }

  /*
   * @method: sendToQueue
   * This method queue a message of a channel.
   * @params: queue: queue name for subscribing, message: message to send to queue.
   */
  sendToQueue(queue: string, message: string) {
    this.connect()
      .then((channel: any) => this.createQueue(channel, queue))
      .then((channel: any) =>
        channel.sendToQueue(queue, Buffer.from(message)),
      )
      .catch((err: any) => console.log(err));
  }
}

export default Mq;
