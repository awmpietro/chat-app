"use strict";
var Users = /** @class */ (function () {
    function Users() {
        var _this = this;
        this.userJoin = function (userId, userName, userRoom) {
            var user = { userId: userId, userName: userName, userRoom: userRoom };
            _this.users.push(user);
            return user;
        };
        this.userLeft = function (userId) {
            var idx = _this.users.findIndex(function (user) { return user.userId === userId; });
            return idx !== -1 ? _this.users.splice(idx, 1)[0] : null;
        };
        this.roomUsers = function (userRoom) {
            return _this.users.filter(function (user) { return user.userRoom === userRoom; });
        };
        this.getUser = function (userId) {
            return _this.users.find(function (user) { return user.userId === userId; });
        };
        this.users = [];
    }
    return Users;
}());
module.exports = Users;
