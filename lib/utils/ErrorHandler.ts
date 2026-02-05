import { logout } from "@/redux/actions/authAction";
import store from "@/redux/store";
import _ from 'lodash'

export enum AuthErrors {
  LogOut = "Session Expired, Loging Out!",
  LoginNeeded = "Previous Session Expired, Please login Again!",
}
export const handlerError = (e: any) => {
  const UNAUTHORIZED = 401;
  const NETWORK_ERROR = 0;
  if (e.response && e.response.status === NETWORK_ERROR) {
    return ["Internal server error, please try again later"];
  }
  try {
    if (e.response) {
      if (e.response.status === UNAUTHORIZED) {
        /**
         * Following check is necessary ti prevent
         * from infinite loop.
         */
        if (store.getState().auth.isAuthenticated) {
          store.dispatch(logout());
          return [AuthErrors.LogOut];
        }
        return [AuthErrors.LoginNeeded];
      }
      return _.isEmpty(e.response.data.errors)
        ? ["Error Occured"]
        : (e.response.data.errors as Record<string, string>[]).map((error) => {
            return error.msg;
          });
    }
    return [e.message || "Error Occured!"];
  } catch (err: any) {
    return [err.message || "Error Occured!"];
  }
};
