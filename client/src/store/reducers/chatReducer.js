import { NEW_MESSAGE } from "../types";

const INITIAL_STATE = { messages: [] };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_MESSAGE: {
      return { ...state, messages: [...state.messages, action.payload] };
    }
    default:
      return state;
  }
};
