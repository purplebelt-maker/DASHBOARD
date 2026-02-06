import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setEventsFailure, setEventsSuccess, setTodayEventsFailure, setTodayEventsSuccess } from "../reducers/eventReducer";
import { EventsQueryParams } from "@/types/events/filters";

export const backendUrl = "http://localhost:6900";
export const config = {
  headers: {
    "Content-Type": " application/json ", // application/x-www.form-urlencoded
  },
};

// export const backendUrl = "https://api.predictionmarketedge.com";

export const BackendInstance = axios.create({
  baseURL: `${backendUrl}/api/`,
  withCredentials: true,
});

export const getEvents = createAsyncThunk(
  "events/get",
  async (params: EventsQueryParams, { dispatch }) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.append("page", params.page.toString());
      if (params.limit) query.append("limit", params.limit.toString());

      if (params.categoryId?.length) {
        params.categoryId.forEach((id) =>
          query.append("categoryId", id.toString()),
        );
      }

      if (params.sortBy) query.append("sortBy", params.sortBy);
      if (params.sortOrder) query.append("sortOrder", params.sortOrder);
      if (params.endingIn) query.append("endingIn", params.endingIn);

      const res = await BackendInstance.get(`events?${query.toString()}`);

      dispatch(setEventsSuccess(res.data.data));
      return true;
    } catch (err) {
      dispatch(setEventsFailure());
      throw false;
    }
  },
);

interface ISuggesstionPayload {
  email?: string;
  feedback: string;
}

export const submitSuggesstion = createAsyncThunk(
  "events/get",
  async (data: ISuggesstionPayload, { dispatch }) => {
    try {
      const _data = JSON.stringify(data);
      const res = await BackendInstance.post(`/events/email`, _data, config);

      return true;
    } catch (err) {
      throw false;
    }
  },
);

// today events

export const getTodayEvents = createAsyncThunk(
  "events/get",
  async (_, { dispatch }) => {
    try {
      const res = await BackendInstance.get(`events/today`);

      dispatch(setTodayEventsSuccess(res.data.data));
      return true;
    } catch (err) {
      dispatch(setTodayEventsFailure());
      throw false;
    }
  },
);
