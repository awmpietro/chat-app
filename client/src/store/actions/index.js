import io from "socket.io-client";
import axios from "axios";

import {
  NEW_MESSAGE,
  NEW_USER,
  LOGIN,
  REGISTER,
  LOGOUT,
  SIGN_ERROR,
} from "../types";
import Auth from "../../lib/JwtAuth";

const URL = process.env.REACT_APP_SERVER_URL;
let socket;

const socketHandle = user => {
  return dispatch => {
    socket = io.connect(URL, { query: { token: Auth.getToken() } });
    socket.emit("joinRoom", user);

    socket.on("newMessage", res => {
      dispatch(newMessage(res));
    });
    socket.on("newUser", res => {
      dispatch(newUser(res));
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

const newUser = payload => {
  return dispatch => {
    dispatch({
      type: NEW_USER,
      payload,
    });
  };
};

const login = cred => {
  return async dispatch => {
    try {
      const user = await axios.post(`${URL}/login`, {
        credentials: { email: cred.email, password: cred.password },
      });
      Auth.setToken(user.data.token, user.data.user.id, user.data.user.name);
      dispatch([
        socketHandle({ userName: user.data.user.name, userRoom: cred.room }),
        {
          type: LOGIN,
          payload: {
            isSignedIn: true,
            user: {
              userId: user.data.user.id,
              userName: user.data.user.name,
              userRoom: cred.room,
            },
          },
        },
      ]);
    } catch (error) {
      let err = "";
      if (error.response.data) {
        err = error.response.data;
      } else {
        err = error.message;
      }
      dispatch({
        type: SIGN_ERROR,
        error: err,
      });
    }
  };
};

const logout = () => {
  return dispatch => {
    Auth.logout();
    dispatch([{ type: LOGOUT }, socketDisconnect()]);
  };
};

const register = cred => {
  return async dispatch => {
    try {
      const user = await axios.post(`${URL}/register`, {
        credentials: {
          name: cred.name,
          email: cred.email,
          password: cred.password,
        },
      });
      Auth.setToken(user.data.token, user.data.user.id, user.data.user.name);
      dispatch([
        socketHandle({ userName: user.data.user.name, userRoom: cred.room }),
        {
          type: REGISTER,
          payload: {
            isSignedIn: true,
            user: {
              userId: user.data.user.id,
              userName: user.data.user.name,
              userRoom: cred.room,
            },
          },
        },
      ]);
    } catch (error) {
      let err = "";
      if (error.response.data) {
        err = error.response.data;
      } else {
        err = error.message;
      }
      dispatch({
        type: SIGN_ERROR,
        error: err,
      });
    }
  };
};

export {
  socketHandle,
  socketDisconnect,
  chatMessage,
  newMessage,
  login,
  register,
  logout,
};
