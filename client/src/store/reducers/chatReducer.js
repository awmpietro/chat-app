import { NEW_MESSAGE, LOGIN, REGISTER } from "../types";

const INITIAL_STATE = {
  messages: [],
  isLoggedIn: false,
  user: { userId: "", userName: "", userRoom: "" },
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
    default:
      return state;
  }
};
