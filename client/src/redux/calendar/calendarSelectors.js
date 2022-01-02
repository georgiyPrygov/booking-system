
const getReservations = (state) => state.calendar.calendarData.reservations;
const getDisabledDates = (state) => state.calendar.calendarData.disabledDates;
const getRange = (state) => state.calendar.calendarData.range;
const getEditedRange = (state) => state.calendar.calendarData.editedRange;
const getReservationsState = state => state.calendar.calendarData.reservationsState;
const getBookingRange = (state) => state.calendar.calendarData.bookingRange;
const getGuests = (state) => state.calendar.calendarData.guests;

  
  export default {
    getReservations,
    getDisabledDates,
    getRange,
    getEditedRange,
    getBookingRange,
    getReservationsState,
    getGuests
  };
  