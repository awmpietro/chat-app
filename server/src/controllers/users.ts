interface User {
  userId: string;
  userName: string;
  userRoom: string;
}

/*
 * @class: Users
 * Users is responsible for handling users of the chat.
 */
class Users {
  public users: User[];

  /*
   * @method: constructor
   * The constructor memthod handles all initializations needed when an object is instatiated.
   */
  constructor() {
    this.users = [];
  }

  /*
   * @method: userJoin
   * This method pushes an user into the array of users.
   * @params: userId: Id of user, userName: name of the user, userRoom: name of the room which user is joining.
   * @return: user: new user
   */
  userJoin = (
    userId: string,
    userName: string,
    userRoom: string,
  ): any => {
    const user = { userId, userName, userRoom };
    this.users.push(user);
    return user;
  };

  /*
   * @method: userLeft
   * This method pops an user from array of users when disconnects.
   * @params: userId: Id of user.
   * @return: user: just removed user
   */
  userLeft = (userId: string) => {
    const idx = this.users.findIndex(
      (user) => user.userId === userId,
    );
    return idx !== -1 ? this.users.splice(idx, 1)[0] : null;
  };

  /*
   * @method: roomUsers
   * This method returns users by a room.
   * @params: userRoom: name of the room.
   * @return: users: users by room
   */
  roomUsers = (userRoom: string) => {
    return this.users.filter((user) => user.userRoom === userRoom);
  };

  /*
   * @method: getUser
   * This method returns an user by it's Id.
   * @params: userId: id of the user.
   * @return: user: user by id
   */
  getUser = (userId: string): any => {
    return this.users.find((user) => user.userId === userId);
  };
}

module.exports = Users;
