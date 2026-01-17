import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setEventsFailure, setEventsSuccess } from "../reducers/eventReducer";

export const backendUrl = "http://localhost:6900";

export const BackendInstance = axios.create({
  baseURL: `${backendUrl}/api/`,
  withCredentials: true,
});
export const getEvents = createAsyncThunk(
  "activityLogs/get",
  async (data, { dispatch }) => {
    try {
      const res = await BackendInstance.get(`events`);
      dispatch(setEventsSuccess(res.data.data));
      return true;
    } catch (err) {
      dispatch(setEventsFailure());

      return false;
    }
  },
);
