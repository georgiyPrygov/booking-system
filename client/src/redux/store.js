import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer";
import calendarReducer from "./calendar/calendarReducer";
import snackbarReducer from "./snackbar/snackbarReducer";


const store = configureStore({
  reducer: {
    user: authReducer,
    calendar: calendarReducer,
    snackbar: snackbarReducer
  },
  middleware: [
    ...getDefaultMiddleware({
        serializableCheck: false
    }),
],
  devTools: process.env.NODE_ENV === "development"
});

export default store;
