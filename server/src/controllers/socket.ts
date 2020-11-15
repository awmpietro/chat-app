export {};
const socketIo = require('socket.io');
const moment = require('moment');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib/callback_api');

const Users = require('./users');

class Socket {
  private io: SocketIO.Server;
  private chatBotName: string = 'Chat App';
  public rabbitMq: typeof amqp;
  public users: Users;

  constructor(server: any) {
    this.io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.users = new Users();
    this.socketInit();
  }

  amqpConn = () => {
    amqp.connect('http://localhost:5762' + '?heartbeat=60', function (
      err,
      conn,
    ) {
      if (err) {
        console.error('[AMQP]', err.message);
        return setTimeout(start, 1000);
      }
      conn.on('error', function (err) {
        if (err.message !== 'Connection closing') {
          console.error('[AMQP] conn error', err.message);
        }
      });
      conn.on('close', function () {
        console.error('[AMQP] reconnecting');
        return setTimeout(start, 1000);
      });
      console.log('[AMQP] connected');
      this.rabbitMq = conn;
      whenConnected();
    });
  };

  joinRoom = (socket: any, userName: string, userRoom: string) => {
    const user = this.users.userJoin(socket.id, userName, userRoom);
    socket.join(user.userRoom);

    socket.emit('newMessage', {
      user: {
        userId: socket.id,
        userName: this.chatBotName,
        userRoom,
      },
      message: 'Welcome to Chat App',
      date: moment().format('MM/DD/YY HH:mm:ss'),
    }); // only the client

    socket.broadcast.to(user.userRoom).emit('newMessage', {
      user: {
        userId: socket.id,
        userName: this.chatBotName,
        userRoom,
      },
      message: `${user.userName} has joined the chat`,
      date: moment().format('MM/DD/YYYY HH:mm:ss'),
    }); // everybody but the client
  };

  message = async (socket: any, msg: any) => {
    const user = this.users.getUser(socket.id);
    if (msg.msg.startsWith('/stock=')) {
      const fmtMsg: string[] = msg.msg.split('=');
      // Send to bot, bot will queue
      axios
        .get(`${process.env.BOT_URL}/get-stock?stock=${fmtMsg[1]}`)
        .catch((error: Error) => {
          console.log(error);
        });

      // CONSUMER OF THE QUEUE

      this.rabbitMq.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on('error', function (err) {
          console.error('[AMQP] channel error', err.message);
        });
        ch.on('close', function () {
          console.log('[AMQP] channel closed');
        });

        ch.prefetch(10);
        ch.assertQueue('jobs', { durable: true }, function (
          err,
          _ok,
        ) {
          if (closeOnErr(err)) return;
          ch.consume(
            'jobs',
            (results) => {
              const message = {
                user,
                message: results.stock,
                date: moment().format('MM/DD/YYYY HH:mm:ss'),
              };
              socket.emit('newMessage', message); // only client
            },
            { noAck: false },
          );
        });
      });
    } else {
      const message = {
        user,
        message: msg.msg,
        date: moment().format('MM/DD/YYYY HH:mm:ss'),
      };
      this.io.emit('newMessage', message); // everybody including client
    }
  };

  disconnect = (socket: any) => {
    const leftUser = this.users.userLeft(socket.id);
    if (leftUser) {
      this.io.to(leftUser.userRoom).emit('newMessage', {
        user: {
          userId: socket.id,
          userName: this.chatBotName,
          userRoom: leftUser.userRoom,
        },
        message: `${leftUser.userName} has left the chat`,
        date: moment().format('MM/DD/YY HH:mm:ss'),
      });
    }
  };

  socketInit = (): void => {
    this.io
      .use((socket: any, next: any) => {
        if (socket.handshake.query && socket.handshake.query.token) {
          jwt.verify(
            socket.handshake.query.token,
            process.env.SECRET_KEY,
            (err: Error, decoded: any) => {
              if (err) return next(new Error('Authentication error'));
              socket.decoded = decoded;
              next();
            },
          );
        } else {
          next(new Error('Authentication error'));
        }
      })
      .on('connection', (socket: any) => {
        socket.on(
          'joinRoom',
          ({
            userName,
            userRoom,
          }: {
            userName: string;
            userRoom: string;
          }) => {
            this.joinRoom(socket, userName, userRoom);
          },
        );

        /* Users */
        socket.on('message', (msg: any) => {
          this.message(socket, msg);
        });

        socket.on('disconnect', () => {
          this.disconnect(socket);
        });
      });
  };
}

module.exports = Socket;
