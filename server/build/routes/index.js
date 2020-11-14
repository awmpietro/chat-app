"use strict";
var login = function (req, res) {
    res.json('Login Working');
};
var register = function (req, res) {
    res.json('Register Working');
};
module.exports = { login: login, register: register };
