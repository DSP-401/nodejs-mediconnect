import { applyMiddleware, createStore } from "redux";
import ThunkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

const Store = createStore(rootReducer, applyMiddleware(ThunkMiddleware));

export default Store;
