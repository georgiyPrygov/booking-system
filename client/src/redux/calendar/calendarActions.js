import { createAction } from '@reduxjs/toolkit';


const getReservations = createAction('calendar/getReservations');
const getDisabledDates = createAction('calendar/getDisabledDates');
const addReservation = createAction('calendar/addReservation');
const deleteReservation = createAction('calendar/deleteReservation');
const updateReservation = createAction('calendar/updateReservation');
const updateReservationsCount = createAction('calendar/updateReservationsCount');
const setEditedRange = createAction('calendar/setEditedRange');
const setBookingRange = createAction('calendar/setBookingRange');
const setGuests = createAction('calendar/setGuests');
const setAvailableRooms = createAction('calendar/setAvailableRooms');
const setDatePickerState = createAction('calendar/setDatePickerState');
const setNightsCount = createAction('calendar/setNightsCount');
const setTotalPrice = createAction('calendar/setTotalPrice');


const setRange = createAction('calendar/setRange');



export default {
    getReservations,
    getDisabledDates,
    addReservation,
    deleteReservation,
    updateReservation,
    updateReservationsCount,
    setEditedRange,
    setBookingRange,
    setGuests,
    setRange,
    setAvailableRooms,
    setDatePickerState,
    setNightsCount,
    setTotalPrice
}