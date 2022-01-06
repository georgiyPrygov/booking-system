
const getReservations = (state) => state.calendar.calendarData.reservations;
const getDisabledDates = (state) => state.calendar.calendarData.disabledDates;
const getRange = (state) => state.calendar.calendarData.range;
const getEditedRange = (state) => state.calendar.calendarData.editedRange;
const getReservationsState = state => state.calendar.calendarData.reservationsState;
const getBookingRange = (state) => state.calendar.calendarData.bookingRange;
const getGuests = (state) => state.calendar.calendarData.guests;
const getAvailableRooms = (state) => state.calendar.calendarData.availableRooms;
const getDatePickerState = (state) => state.calendar.calendarData.datePickerState;
const getNightsCount = (state) => state.calendar.calendarData.nightsCount;

  
  export default {
    getReservations,
    getDisabledDates,
    getRange,
    getEditedRange,
    getBookingRange,
    getReservationsState,
    getGuests,
    getAvailableRooms,
    getDatePickerState,
    getNightsCount
  };
  