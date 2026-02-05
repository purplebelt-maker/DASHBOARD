import { combineReducers } from "@reduxjs/toolkit";
import eventReducer, { eventsSelector } from "./eventReducer";
import authReducer, { authSelector } from "./authReducer";
import alertReducer, { AlertSelector } from "./alertReducer";
import { RESET } from "../middleware/root/events";

const appReducer = combineReducers({
  event: eventReducer,
  auth: authReducer,
  alert: alertReducer,
});

export { eventsSelector, authSelector, AlertSelector };

export type RootState = ReturnType<typeof appReducer>;

/**
 * Resets state on logout if needed
 *
 * @param {RootState} state - current action state dispatched from actions
 * @param {any} action - current action dispatched
 * @returns {Reducer<CombinedState>} returns combined state
 */
export const rootReducer = (state: RootState, action: any) => {
  if (action.type === RESET) {
    return appReducer({} as RootState, action);
  }
  return appReducer(state, action);
};

export default appReducer;
