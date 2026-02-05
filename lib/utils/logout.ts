import { BackendInstance, config } from "@/redux/actions/eventsAction";

/**
 * Logs out a user from the backend and frontend
 *
 * @returns {Promise<any>} Promise resolved on post request to logout api
 */
export const userLogout = async () => {
  /*
    Donot Include in try catch, calling function 
    will handle it
    */
  return await BackendInstance.post("user/logout", {}, config);
};

/**
 * removes token cookie from session cookie
 *
 */
export const removeSecondaryToken = () => {
  console.log("GOING TO REMOVE THE SECONDARY TOKEN");
  /*
    Useful For Offline Logout
    */
  document.cookie =
    "token=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
