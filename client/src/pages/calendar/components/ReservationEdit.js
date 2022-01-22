import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import {
  TextField,
  Box,
  CardActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import calendarOperations from "../../../redux/calendar/calendarOperations";
import "react-day-picker/lib/style.css";
import RangePicker from "./RangePicker";
import { useParams } from "react-router";
import roomsData from "../../../utils/roomsData";
import moment from 'moment';

const ReservationsEdit = ({
  editedReservation,
  setModalState,
  updateReservation,
  deleteReservation,
  editedRange
}) => {
  const {id} = useParams();
  const initialState = {
    name: "",
    email: "",
    descr: "",
    phone: "",
    start: null,
    end: null,
    title: "",
    roomType: id,
    roomPrice: roomsData[id].price,
    paymentStatus: false,
    guests: 2,
    totalPrice: null,
    nightsCount: null,
    bookingDate: null
  }
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(editedReservation[0]);
    if(form.name !== '' && editedRange.to !== null) {
      setForm({...form, start: editedRange.from, end: editedRange.to, nightsCount: moment(editedRange.to).diff(moment(editedRange.from), 'days' )})
    }
  }, [editedReservation,editedRange]);


useEffect(() => {
    setForm({...form, totalPrice: form.nightsCount * form.roomPrice});
}, [form.roomPrice, form.nightsCount]);

useEffect(() => {
  setForm({...form, roomType: id, roomPrice: roomsData[id].price});
},[id])

  


  const changeHandler = (e) => {
    if (e.target.name === "name") {
      setForm({
        ...form,
        name: e.target.value,
        title: e.target.value,
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    if(e.target.name === "paymentStatus") {
      setForm({...form, paymentStatus: e.target.checked})
    }
  };
  const handleSubmit = () => {
    updateReservation(form);
    setModalState(false);
  };

  const handleDelete = () => {
    deleteReservation(form._id);
    setModalState(false);
  };

  return (
    <Box className="reservation-edit-form">
      <Typography variant="h5" component="h5" sx={{ marginBottom: 20 + "px" }}>
        Изменение резервации
      </Typography>
      <RangePicker editedReservation={editedReservation} />

      <TextField
        required
        id="name"
        label="Имя гостя"
        name="name"
        placeholder="Введите имя гостя"
        onChange={changeHandler}
        value={form.name}
        fullWidth
        margin="normal"
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        required
        id="email"
        label="Email"
        name="email"
        placeholder="Введите эмейл"
        onChange={changeHandler}
        value={form.email}
        type="email"
        fullWidth
        margin="normal"
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        required
        id="phone"
        label="Телефон"
        name="phone"
        placeholder="Введите телефон"
        onChange={changeHandler}
        value={form.phone}
        fullWidth
        margin="normal"
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        id="details"
        label="Детали"
        name="descr"
        placeholder="Введите детали бронирования"
        onChange={changeHandler}
        value={form.descr}
        fullWidth
        margin="normal"
        size="small"
        multiline
        minRows={4}
        InputLabelProps={{ shrink: true }}
      />
      <Box className="guests-and-price">
        <TextField
          id="guests"
          label="Колличество гостей"
          name="guests"
          placeholder="2"
          onChange={changeHandler}
          value={form.guests}
          margin="normal"
          size="small"
          InputLabelProps={{ shrink: true }}
          type="number"
        />
        <TextField
          required
          id="price"
          label="Цена за ночь"
          name="roomPrice"
          placeholder="1300"
          onChange={changeHandler}
          value={form.roomPrice}
          type="number"
          margin="normal"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Box className="price-and-payment">
        <FormControlLabel
          className="prepayment-checkbox"
          control={
            <Checkbox
              name="paymentStatus"
              checked={form.paymentStatus !== null ? form.paymentStatus : false}
              onChange={changeHandler}
            />
          }
          label="Предоплата"
        />
      </Box>
      <CardActions className="card-actions">
        <Button variant="text" onClick={handleDelete} color="error">
          Удалить
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Подтвердить
        </Button>
      </CardActions>
    </Box>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  editedRange: calendarSelectors.getEditedRange(state)
});
const mapDispatchToProps = (dispatch) => ({
  updateReservation: (data) =>
    dispatch(calendarOperations.updateReservation(data)),
  deleteReservation: (id) => dispatch(calendarOperations.deleteReservation(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReservationsEdit);
