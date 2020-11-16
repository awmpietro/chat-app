"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @class: Users
 * Users is responsible for handling users of the chat.
 */
var Users = /** @class */ (function () {
    /*
     * @method: constructor
     * The constructor memthod handles all initializations needed when an object is instatiated.
     */
    function Users() {
        var _this = this;
        /*
         * @method: userJoin
         * This method pushes an user into the array of users.
         * @params: userId: Id of user, userName: name of the user, userRoom: name of the room which user is joining.
         * @return: user: new user
         */
        this.userJoin = function (userId, userName, userRoom) {
            var user = { userId: userId, userName: userName, userRoom: userRoom };
            _this.users.push(user);
            return user;
        };
        /*
         * @method: userLeft
         * This method pops an user from array of users when disconnects.
         * @params: userId: Id of user.
         * @return: user: just removed user
         */
        this.userLeft = function (userId) {
            var idx = _this.users.findIndex(function (user) { return user.userId === userId; });
            return idx !== -1 ? _this.users.splice(idx, 1)[0] : null;
        };
        /*
         * @method: roomUsers
         * This method returns users by a room.
         * @params: userRoom: name of the room.
         * @return: users: users by room
         */
        this.roomUsers = function (userRoom) {
            return _this.users.filter(function (user) { return user.userRoom === userRoom; });
        };
        /*
         * @method: getUser
         * This method returns an user by it's Id.
         * @params: userId: id of the user.
         * @return: user: user by id
         */
        this.getUser = function (userId) {
            return _this.users.find(function (user) { return user.userId === userId; });
        };
        this.users = [];
    }
    return Users;
}());
exports.default = Users;
