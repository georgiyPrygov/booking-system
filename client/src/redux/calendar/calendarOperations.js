import axios from 'axios'
import calendarActions from "./calendarActions";
import snackbarActions from '../snackbar/snackbarActions';

const getReservations = ({userId, roomType, isAdmin}) => dispatch => {
    axios
    .get("/api/reservations", {params: {userId, roomType, isAdmin}})
    .then((response) => {
      dispatch(calendarActions.getReservations(response.data));
    })
    .catch((e) => {
      dispatch(snackbarActions.getData({message: e.message, status: 'error'}))
      dispatch(snackbarActions.setIsOpened(true))
    });
}
const addReservation = reservation => dispatch => {
    axios
    .post("/api/reservations", { ...reservation })
    .then((response) => {
        dispatch(calendarActions.addReservation(reservation));
        dispatch(calendarActions.updateReservationsCount(1));  
      dispatch(snackbarActions.getData({message: response.data.message, status: 'success'}))
      dispatch(snackbarActions.setIsOpened(true))
    })
    .catch((e) => {
      dispatch(snackbarActions.getData({message: e.message, status: 'error'}))
      dispatch(snackbarActions.setIsOpened(true))
    });
}
const deleteReservation = id => dispatch => {
    axios
    .delete("/api/reservations", {params: {id}})
    .then((response) => {
      dispatch(calendarActions.deleteReservation(id)); 
      dispatch(calendarActions.updateReservationsCount(false));
      dispatch(snackbarActions.getData({message: response.data.message, status: 'success'}))
      dispatch(snackbarActions.setIsOpened(true))
    })
    .catch((e) => {
      dispatch(snackbarActions.getData({message: e.message, status: 'error'}))
      dispatch(snackbarActions.setIsOpened(true))
    });
}
const updateReservation = (data) => dispatch => {
  axios
  .patch("/api/reservations", {...data})
  .then((response) => {
    dispatch(calendarActions.updateReservation(response.data));
    dispatch(snackbarActions.getData({message: 'Бронирование успешно изменено', status: 'success'}))
    dispatch(snackbarActions.setIsOpened(true))
  })
  .catch((e) => {
    dispatch(snackbarActions.getData({message: e.message, status: 'error'}))
    dispatch(snackbarActions.setIsOpened(true))
  });
}
const setRange = ({start, end}) => dispatch => {
  dispatch(calendarActions.setRange({start, end})); 
}
const setEditedRange = (data) => dispatch => {
  dispatch(calendarActions.setEditedRange(data)); 
}
const setBookingRange = (data) => dispatch => {
  dispatch(calendarActions.setBookingRange(data)); 
}
const setGuests = (obj) => dispatch => {
  dispatch(calendarActions.setGuests(obj)); 
}
const setAvailableRooms = (obj) => dispatch => {
  dispatch(calendarActions.setAvailableRooms(obj));
}
const setDatePickerState = data => dispatch => {
  dispatch(calendarActions.setDatePickerState(data))
}
const setNightsCount = number => dispatch => {
  dispatch(calendarActions.setNightsCount(number))
}
const setTotalPrice = number => dispatch => {
  dispatch(calendarActions.setTotalPrice(number))
}
export default {
    getReservations,
    addReservation,
    deleteReservation,
    updateReservation,
    setEditedRange,
    setBookingRange,
    setGuests,
    setRange,
    setAvailableRooms,
    setDatePickerState,
    setNightsCount,
    setTotalPrice,
}