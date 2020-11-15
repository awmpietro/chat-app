"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var amqp = require('amqplib/callback_api');
var Mq = /** @class */ (function () {
    function Mq() {
        var _this = this;
        this.amqpConn = null;
        this.pubChannel = null;
        this.offlinePubQueue = [];
        this.start = function () {
            amqp.connect('amqp://localhost:5762' + '?heartbeat=60', function (err, conn) {
                if (err) {
                    console.error('[AMQP]', err.message);
                    return setTimeout(_this.start, 1000);
                }
                conn.on('error', function (err) {
                    if (err.message !== 'Connection closing') {
                        console.error('[AMQP] conn error', err.message);
                    }
                });
                conn.on('close', function () {
                    console.error('[AMQP] reconnecting');
                    return setTimeout(_this.start, 1000);
                });
                console.log('[AMQP] connected');
                _this.amqpConn = conn;
                _this.startPublisher();
            });
        };
        this.startPublisher = function () {
            _this.amqpConn.createConfirmChannel(function (err, ch) {
                if (_this.closeOnErr(err))
                    return;
                ch.on('error', function (err) {
                    console.error('[AMQP] channel error', err.message);
                });
                ch.on('close', function () {
                    console.log('[AMQP] channel closed');
                });
                _this.pubChannel = ch;
                while (true) {
                    var _a = _this.offlinePubQueue.shift(), exchange = _a[0], routingKey = _a[1], content = _a[2];
                    _this.publish(exchange, routingKey, content);
                }
            });
        };
        this.closeOnErr = function (err) {
            if (!err)
                return false;
            console.error('[AMQP] error', err);
            _this.amqpConn.close();
            return true;
        };
        this.publish = function (exchange, routingKey, content) {
            try {
                _this.pubChannel.publish(exchange, routingKey, content, { persistent: true }, function (err, ok) {
                    if (err) {
                        console.error('[AMQP] publish', err);
                        _this.offlinePubQueue.push([
                            exchange,
                            routingKey,
                            content,
                        ]);
                        _this.pubChannel.connection.close();
                    }
                });
            }
            catch (e) {
                console.error('[AMQP] publish', e.message);
                _this.offlinePubQueue.push([exchange, routingKey, content]);
            }
        };
        this.start();
    }
    return Mq;
}());
module.exports = Mq;
