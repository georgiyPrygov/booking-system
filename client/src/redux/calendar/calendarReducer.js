import { combineReducers, createReducer } from "@reduxjs/toolkit";
import actions from "./calendarActions";

const calendarState = {
  reservations: [],
  disabledDates: [],
  range: null,
  reservationsState: 0,
  editedRange: {from:null, to: null}
};

const calendarData = createReducer(calendarState, {
  [actions.getReservations]: (state, { payload }) => ({
    ...state,
    reservations: payload,
  }),
  [actions.getDisabledDates]: (state, { payload }) => ({
    ...state,
    disabledDates: payload,
  }),
  [actions.addReservation]: (state, { payload }) => ({
    ...state,
    reservations: [...state.reservations, payload],
  }),
  [actions.deleteReservation]: (state, { payload }) => ({
    ...state,
    reservations: state.reservations.filter((item) => item._id !== payload),
  }),
  [actions.updateReservation]: (state, { payload }) => ({...state, reservations: [...state.reservations.map(item => {if(item._id === payload._id) {return payload } return item }) ]  }),
  [actions.updateReservationsCount]: (state, { payload }) => ({
    ...state,
    reservationsState: payload + 1,
  }),
  [actions.setRange]: (state, { payload }) => ({ ...state, range: payload }),
  [actions.setEditedRange]: (state, { payload }) => ({ ...state, editedRange: payload }),
});

export default combineReducers({
  calendarData,
});
