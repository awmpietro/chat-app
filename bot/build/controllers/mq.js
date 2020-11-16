"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @class: Mq
 * Mq is responsible for managing rabbit mq for the consumer/subscriber.
 */
var Mq = /** @class */ (function () {
    function Mq() {
    }
    /*
     * @method: connect
     * This method returns a connnection to the rabbit mq.
     */
    Mq.prototype.connect = function () {
        return require('amqplib')
            .connect(process.env.MESSAGE_QUEUE)
            .then(function (conn) { return conn.createChannel(); });
    };
    /*
     * @method: createQueue
     * This method returns a Promise containing the rabbit mq communication's channel.
     * @params: channel: communication's channel created on connection, queue: queue name for subscribing
     */
    Mq.prototype.createQueue = function (channel, queue) {
        return new Promise(function (resolve, reject) {
            try {
                channel.assertQueue(queue, { durable: true });
                resolve(channel);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /*
     * @method: sendToQueue
     * This method queue a message of a channel.
     * @params: queue: queue name for subscribing, message: message to send to queue.
     */
    Mq.prototype.sendToQueue = function (queue, message) {
        var _this = this;
        this.connect()
            .then(function (channel) { return _this.createQueue(channel, queue); })
            .then(function (channel) {
            return channel.sendToQueue(queue, Buffer.from(message));
        })
            .catch(function (err) { return console.log(err); });
    };
    return Mq;
}());
module.exports = Mq;
