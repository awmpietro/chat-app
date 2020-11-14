interface User {
  userId: string;
  userName: string;
  userRoom: string;
}

class Users {
  public users: User[];

  constructor() {
    this.users = [];
  }

  userJoin = (
    userId: string,
    userName: string,
    userRoom: string,
  ): any => {
    const user = { userId, userName, userRoom };
    this.users.push(user);
    return user;
  };

  userLeft = (userId: string) => {
    const idx = this.users.findIndex(
      (user) => user.userId === userId,
    );
    return idx !== -1 ? this.users.splice(idx, 1)[0] : null;
  };

  roomUsers = (userRoom: string) => {
    return this.users.filter((user) => user.userRoom === userRoom);
  };

  getUser = (userId: string): any => {
    return this.users.find((user) => user.userId === userId);
  };
}

module.exports = Users;
