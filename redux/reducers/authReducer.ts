import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState, IUser } from "@/types/auth";
import { RESET } from "../middleware/root/events";
import { removeSecondaryToken } from "@/lib/utils/logout";

const initialState: IAuthState = {
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoaded: (state, { payload }: PayloadAction<IAuthState>) => {
      const authToken = payload.token;
      delete payload.token;

      state.isAuthenticated = payload.isAuthenticated;
      state.loading = false;
      state.role = payload.role;
      state.user = payload.user;
      state.token = authToken;
    },

    clearSession: (state) => {
      removeSecondaryToken();
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET, () => ({
      user: null,
      token: null,
      loading: false,
    }));
  },
});

export const { userLoaded, clearSession } = authSlice.actions;

export const authSelector = (state: { auth: IAuthState }): IAuthState =>
  state.auth;

export default authSlice.reducer;
