import { IEvent, IEventResponse, IEventState } from "@/types/events/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toFormData } from "axios";

const initialState: IEventState = {
  data: null,
  loading: true,
  todayEvents: null,
  todayEventsLoading: true,
};

const eventsSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {
    setEventsSuccess: (state, { payload }: PayloadAction<IEventResponse>) => {
      state.data = payload;
      state.loading = false;
    },
    setEventsFailure: (state) => {
      state.loading = false;
    },
    setTodayEventsSuccess: (state, { payload }: PayloadAction<IEvent[]>) => {
      state.todayEvents = payload;
      state.todayEventsLoading = false;
    },
    setTodayEventsFailure: (state) => {
      state.todayEventsLoading = false;
    },
  },
});

export const {
  setEventsFailure,
  setEventsSuccess,
  setTodayEventsFailure,
  setTodayEventsSuccess,
} = eventsSlice.actions;
export default eventsSlice.reducer;

/**
 * Selector for accessing guide state.
 *
 * @param {Object} state - Root Redux state
 * @returns {IGuideState} - Guide state object
 */
export const eventsSelector = (state: { event: IEventState }): IEventState =>
  state.event;
