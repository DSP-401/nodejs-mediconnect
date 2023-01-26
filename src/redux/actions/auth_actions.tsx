import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS } from "../constants";
import { Auth_Services } from "../services";

// import auth_services from "../services/auth_services";

const defaultDispatchAction = (type: string, payload: object) => ({
  type,
  payload,
});
export const loginAction = (data: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, any>): Promise<void> => {
    await dispatch(defaultDispatchAction(LOGIN_LOADING, data));
    await Auth_Services.login(data)
      .then((result: any) => {
        dispatch(defaultDispatchAction(LOGIN_SUCCESS, result));
      })
      .catch((error: any) => {
        dispatch(defaultDispatchAction(LOGIN_ERROR, error));
      });
  };
};
