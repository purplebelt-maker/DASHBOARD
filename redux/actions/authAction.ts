import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendInstance, config } from "./eventsAction";
import { userLoaded, clearSession, authReset } from "../reducers/authReducer";
import { ILoginFormData, IRegisterFormData } from "@/types/auth";
import { RESET } from "../middleware/root/events";
import { userLogout } from "@/lib/utils/logout";
import { handlerError } from "@/lib/utils/ErrorHandler";
import { updateAlert } from "./alertAction";

// BackendInstance already has withCredentials: true, so the token cookie
// is sent automatically on every request — no manual header needed.

/**
 * creates user session and logs them in
 *
 * @returns {boolean} true if login form is valid and successful, false otherwise
 */
export const Login = createAsyncThunk(
  "loginSlice/login",
  async (formData: ILoginFormData, { dispatch }) => {
    const body = JSON.stringify(formData);
    try {
      const res = await BackendInstance.post("user/login", body, config);

      dispatch(loadUser());

      return true;
    } catch (err) {
      handlerError(err).forEach((error: string) => {
        dispatch(updateAlert({ place: "tc", message: error, type: "danger" }));
      });
      dispatch(clearSession());
      return false;
    }
  },
);

/**
 * registered new user
 *
 * @returns {boolean} register
 */
export const register = createAsyncThunk(
  "registerSlice/register",
  async (formData: IRegisterFormData, { dispatch }) => {
    const body = JSON.stringify(formData);
    try {
      await BackendInstance.post("user/register", body, config);

      return true;
    } catch (err) {
      handlerError(err).forEach((error: string) => {
        dispatch(updateAlert({ place: "tc", message: error, type: "danger" }));
      });
      return false;
    }
  },
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { dispatch }) => {
    // const LATEST_NOTIFICATION = 0;
    try {
      // const csrfRequest = await BackendInstance.get('csrf');
      // setCsrfToken(csrfRequest.data.data.csrfToken);
      const res = await BackendInstance.post("user/authorization");
      const { role, token } = res.data.data;

      await dispatch(
        userLoaded({
          role: role,
          user: { ...res.data.data },
          token: token,
          isAuthenticated: true,
        }),
      );
      dispatch({
        type: "CONNECT_SOCKET",
      });

      return true;
    } catch (err) {
      console.log("asdasd", err);
      dispatch(clearSession());
      return false;
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    let returnValue = false;
    try {
      /*
      {FOR OFFLINE USE}
      First call api then dispatch
      action beacuse logout requires
      secondary token while dispatching
      logout action remove that.
          */
      await userLogout();

      returnValue = true;
    } catch (err) {
      console.log("ERRORR OCCURRED", err);
      return returnValue;
    } finally {
      /*
      If api return error, still
      dispatch action so that user 
      states are clear and token is removed
      */
      // dispatch({
      //   type: DISCONNECT_SOCKET
      // });
      dispatch({ type: RESET });
      dispatch(authReset());
      dispatch(clearSession());

      // eslint-disable-next-line no-unsafe-finally
      return returnValue;
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "loginSlice/verifyEmail",
  async (emailToken: string, { dispatch }) => {
    const body = JSON.stringify({
      emailToken: emailToken,
    });
    try {
      const res = await BackendInstance.post("user/verify-email", body, config);

      dispatch(
        updateAlert({ place: "tc", message: res.data.msg, type: "success" }),
      );
      return true;
    } catch (err) {
      handlerError(err).forEach((error: string) => {
        dispatch(updateAlert({ place: "tc", message: error, type: "danger" }));
      });
      return false;
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "loginSlice/verifyEmail",
  async (email: string, { dispatch }) => {
    const body = JSON.stringify({
      email: email,
    });
    try {
      const res = await BackendInstance.post(
        "user/forgot-password",
        body,
        config,
      );

      dispatch(
        updateAlert({ place: "tc", message: res.data.msg, type: "success" }),
      );
      return true;
    } catch (err) {
      handlerError(err).forEach((error: string) => {
        dispatch(updateAlert({ place: "tc", message: error, type: "danger" }));
      });
      return false;
    }
  },
);

interface IResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}
export const resetPassword = createAsyncThunk(
  "loginSlice/verifyEmail",
  async (body: IResetPassword, { dispatch }) => {
    const data = JSON.stringify(body);
    try {
      const res = await BackendInstance.post(
        "user/reset-password",
        data,
        config,
      );

      dispatch(
        updateAlert({ place: "tc", message: res.data.msg, type: "success" }),
      );
      return true;
    } catch (err) {
      handlerError(err).forEach((error: string) => {
        dispatch(updateAlert({ place: "tc", message: error, type: "danger" }));
      });
      return false;
    }
  },
);
