import { NEW_MESSAGE, LOGIN, REGISTER, LOGOUT, SIGN_ERROR } from "../types";

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
      return { ...state, messages: [...state.messages, action.payload] };
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
      };
    }
    case SIGN_ERROR: {
      return { ...state, isError: true, errorMessage: action.error };
    }
    default:
      return state;
  }
};
