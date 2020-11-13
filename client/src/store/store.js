import { createStore, applyMiddleware, compose } from "redux";
import promise from "redux-promise";
import multi from "redux-multi";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk, multi, promise));

export default store;
