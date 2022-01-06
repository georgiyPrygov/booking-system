import { combineReducers, createReducer } from "@reduxjs/toolkit";
import actions from "./calendarActions";

const calendarState = {
  reservations: [],
  disabledDates: [],
  range: {start: new Date(), end: new Date()},
  reservationsState: 0,
  editedRange: {from:null, to: null},
  bookingRange: {from:null, to: null},
  guests: {adult: 2, children: 0},
  availableRooms: null,
  datePickerState: false,
  nightsCount: 0
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
  [actions.setBookingRange]: (state, { payload }) => ({ ...state, bookingRange: payload }),
  [actions.setGuests]: (state, { payload }) => ({ ...state, guests: payload }),
  [actions.setAvailableRooms]: (state, { payload }) => ({ ...state, availableRooms: payload }),
  [actions.setDatePickerState]: (state, { payload }) => ({ ...state, datePickerState: payload }),
  [actions.setNightsCount] : (state, { payload }) => ({ ...state, nightsCount: payload })
});

export default combineReducers({
  calendarData,
});
