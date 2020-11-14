import io from "socket.io-client";

import { NEW_MESSAGE, LOGIN, REGISTER } from "../types";

const URL = process.env.REACT_APP_SERVER_URL;
let socket;

const socketHandle = () => {
  return dispatch => {
    socket = io.connect(URL);

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
  return dispatch => {
    socket.disconnect();
  };
};

const newMessage = payload => {
  return { type: NEW_MESSAGE, payload };
};

const login = credentials => {
  return dispatch => {
    dispatch({
      type: LOGIN,
      payload: { isSignedIn: true, user: { id: "01", name: "Arthur" } },
    });
  };
};

const register = credentials => {
  return dispatch => {
    dispatch({
      type: REGISTER,
      payload: { isSignedIn: true, user: { id: "01", name: "Arthur" } },
    });
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
