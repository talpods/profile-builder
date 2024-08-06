import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import exampleReducer from "./example/exampleSlice";
import profileReducer from "./profile/profileSlice";
export const store = configureStore({
  reducer: {
    example: exampleReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
  },
});
