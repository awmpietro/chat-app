import io from "socket.io-client";

import { NEW_MESSAGE, LOGIN, REGISTER } from "../types";

const URL = process.env.REACT_APP_SERVER_URL;
let socket;

const socketHandle = user => {
  return dispatch => {
    socket = io.connect(URL);
    socket.emit("joinRoom", user);

    socket.on("newMessage", res => {
      dispatch(newMessage(res));
    });
  };
};

const chatMessage = msg => {
  return () => {
    socket.emit("message", { msg });
  };
};

const socketDisconnect = () => {
  return () => {
    socket.disconnect();
  };
};

const newMessage = payload => {
  return (dispatch, getState) => {
    if (getState().chat.user.userRoom === payload.user.userRoom) {
      dispatch({
        type: NEW_MESSAGE,
        payload,
      });
    }
  };
};

const login = credentials => {
  return dispatch => {
    const user = { id: "01", name: "Arthur" }; //return from API
    dispatch([
      socketHandle({ userName: user.name, userRoom: credentials.room }),
      {
        type: LOGIN,
        payload: {
          isSignedIn: true,
          user: {
            userId: user.id,
            userName: user.name,
            userRoom: credentials.room,
          },
        },
      },
    ]);
  };
};

const register = credentials => {
  return dispatch => {
    const user = { id: "01", name: "Arthur" }; //return from API
    dispatch([
      socketHandle({ userName: user.name, userRoom: credentials.room }),
      {
        type: REGISTER,
        payload: {
          isSignedIn: true,
          user: {
            userId: user.id,
            userName: user.name,
            userRoom: credentials.room,
          },
        },
      },
    ]);
  };
};

export {
  socketHandle,
  socketDisconnect,
  chatMessage,
  newMessage,
  login,
  register,
};
