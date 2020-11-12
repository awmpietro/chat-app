"use strict";
var chatForm = document.getElementById('chat-form');
var chatMessages = document.querySelector('.chat-messages');
var roomName = document.getElementById('room-name');
var userList = document.getElementById('users');
// Get username and room from URL
var _a = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
}), username = _a.username, room = _a.room;
var socket = io();
// Join chatroom
socket.emit('joinRoom', { username: username, room: room });
// Get room and users
socket.on('roomUsers', function (_a) {
    var room = _a.room, users = _a.users;
    outputRoomName(room);
    outputUsers(users);
});
// Message from server
socket.on('message', function (message) {
    console.log(message);
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Message submit
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Get message text
    var msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
        return false;
    }
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
// Output message to DOM
function outputMessage(message) {
    var div = document.createElement('div');
    div.classList.add('message');
    var p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += "<span>" + message.time + "</span>";
    div.appendChild(p);
    var para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(function (user) {
        var li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
