import axios from 'axios'
import calendarActions from "./calendarActions";
import snackbarActions from '../snackbar/snackbarActions';

const getReservations = ({userId, roomType}) => dispatch => {
    axios
    .get("/api/reservations", {params: {userId, roomType}})
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
export default {
    getReservations,
    addReservation,
    deleteReservation,
    updateReservation,
    setEditedRange,
    setRange
}