import { NEW_MESSAGE, LOGIN, REGISTER } from "../types";

const INITIAL_STATE = {
  messages: [],
  isLoggedIn: false,
  user: { id: "", name: "" },
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
        user: { id: action.payload.user.id, name: action.payload.user.name },
      };
    }
    case REGISTER: {
      return {
        ...state,
        isSignedIn: action.payload.isSignedIn,
        user: { id: action.payload.user.id, name: action.payload.user.name },
      };
    }
    default:
      return state;
  }
};
