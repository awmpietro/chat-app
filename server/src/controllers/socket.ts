const socketIo = require('socket.io');
const moment = require('moment');
const axios = require('axios');

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

  message = async (socket: any, msg: any) => {
    const user = this.users.getUser(socket.id);
    if (msg.msg.startsWith('/stock=')) {
      const fmtMsg: string[] = msg.msg.split('=');
      try {
        const results = await axios.get(
          `http://bot:6060/get-stock?stock=${fmtMsg[1]}`,
        );
        if (results.data.found) {
          const message = {
            user,
            message: results.data.stock,
            date: moment().format('MM/DD/YYYY HH:mm:ss'),
          };
          this.io.emit('newMessage', message); // everybody including client
        } else {
          const message = {
            user,
            message: results.data.stock,
            date: moment().format('MM/DD/YYYY HH:mm:ss'),
          };
          socket.emit('newMessage', message); // only client
        }
      } catch (error) {
        console.log(error.message);
      }
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
