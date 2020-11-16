import {
  NEW_MESSAGE,
  NEW_USER,
  LOGIN,
  REGISTER,
  LOGOUT,
  SIGN_ERROR,
} from "../types";

const INITIAL_STATE = {
  messages: [],
  isLoggedIn: false,
  user: { userId: "", userName: "", userRoom: "" },
  users: [],
  isError: false,
  errorMessage: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_MESSAGE: {
      if (state.messages.length >= 50) {
        state.messages.shift();
      }
      const msgs = [...state.messages, action.payload];
      msgs.sort((x, y) => {
        return x.date - y.date;
      });
      return { ...state, messages: msgs };
    }
    case NEW_USER: {
      return {
        ...state,
        users: [...action.payload.users],
      };
    }
    case LOGIN: {
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
        user: {
          userId: action.payload.user.userId,
          userName: action.payload.user.userName,
          userRoom: action.payload.user.userRoom,
        },
      };
    }
    case REGISTER: {
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
        user: {
          userId: action.payload.user.userId,
          userName: action.payload.user.userName,
          userRoom: action.payload.user.userRoom,
        },
      };
    }
    case LOGOUT: {
      return {
        ...state,
        userId: "",
        userName: "",
        userRoom: "",
        isSignedIn: false,
        users: [],
        messages: [],
      };
    }
    case SIGN_ERROR: {
      return { ...state, isError: true, errorMessage: action.error };
    }
    default:
      return state;
  }
};
