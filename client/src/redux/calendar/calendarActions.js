import { createAction } from '@reduxjs/toolkit';


const getReservations = createAction('calendar/getReservations');
const getDisabledDates = createAction('calendar/getDisabledDates');
const addReservation = createAction('calendar/addReservation');
const deleteReservation = createAction('calendar/deleteReservation');
const updateReservation = createAction('calendar/updateReservation');
const updateReservationsCount = createAction('calendar/updateReservationsCount');
const setEditedRange = createAction('calendar/setEditedRange');
const setBookingRange = createAction('calendar/setBookingRange');

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
    setRange
}