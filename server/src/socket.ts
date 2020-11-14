const socketIo = require('socket.io');
const moment = require('moment');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const AppUsers = require('./users');

class Socket {
  private io: SocketIO.Server;
  private chatBotName: string = 'Chat App';
  public users: Users;

  constructor(server: any) {
    this.io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.users = new AppUsers();
    this.socketInit();
  }

  checkStock = (message: string) => {
    return message.startsWith('/stock=');
  };

  joinRoom = (socket: any, userName: string, userRoom: string) => {
    const user = this.users.userJoin(socket.id, userName, userRoom);
    socket.join(user.userRoom);

    /* Bots */
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

  message = (socket: any, msg: any) => {
    const user = this.users.getUser(socket.id);
    if (this.checkStock(msg.msg)) {
      const fmtMsg: string[] = msg.msg.split('=');
      const url = `https://stooq.com/q/l/?s=${fmtMsg[1]}&f=sd2t2ohlcv&h&e=csv`;
      const results: any = [];
      axios
        .get(url, {
          method: 'get',
          responseType: 'stream',
        })
        .then((res: any) => {
          res.data.pipe(fs.createWriteStream('file.csv'));
          fs.createReadStream('file.csv')
            .pipe(csv())
            .on('data', (data: any) => results.push(data))
            .on('end', () => {
              if (results[0].Close === 'N/D') {
                const message = {
                  user,
                  message: `Stock not found`,
                  date: moment().format('MM/DD/YYYY HH:mm:ss'),
                };
                socket.emit('newMessage', message); // everybody including client
              } else {
                const message = {
                  user,
                  message: `${fmtMsg[1].toUpperCase()} quote is \$${
                    results[0].Close
                  } per share`,
                  date: moment().format('MM/DD/YYYY HH:mm:ss'),
                };
                this.io.emit('newMessage', message); // everybody including client
              }
            });
        })
        .catch((err: Error) => console.log('Error: ' + err.message));
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
    this.io.on('connection', (socket: any) => {
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
      socket.on('message', async (msg: any) => {
        this.message(socket, msg);
      });

      socket.on('disconnect', () => {
        this.disconnect(socket);
      });
    });
  };
}

module.exports = Socket;
