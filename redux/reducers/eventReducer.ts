import { IEventResponse, IEventState } from "@/types/events/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IEventState = {
  data: null,
  loading: true,
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
  },
});

export const { setEventsFailure, setEventsSuccess } = eventsSlice.actions;
export default eventsSlice.reducer;

/**
 * Selector for accessing guide state.
 *
 * @param {Object} state - Root Redux state
 * @returns {IGuideState} - Guide state object
 */
export const eventsSelector = (state: { event: IEventState }): IEventState =>
  state.event;
