import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import { TextField, Box, CardActions, Button, Typography } from "@mui/material";
import calendarOperations from "../../../redux/calendar/calendarOperations";
import "react-day-picker/lib/style.css";
import RangePicker from "./RangePicker";
import moment from "moment";

const ReservationsEdit = ({
  editedReservation,
  setModalState,
  updateReservation,
  editedRange,
  deleteReservation,
}) => {
  const [form, setForm] = useState({});
  const [rangeDates, setRangeDates] = useState({ from: null, to: null });

  useEffect(() => {
    setForm(editedReservation[0]);
  }, [editedReservation]);

  useEffect(() => {
    setRangeDates({ from: form.start, to: form.end });
  }, [form]);

  useEffect(() => {
    if (editedRange.from !== null) {
      setForm({
        ...form,
        start: moment(editedRange.from).utc(0).format("YYYY-MM-DD"),
        end: moment(editedRange.to).utc(0).format("YYYY-MM-DD"),
      });
    }
  }, [editedRange]);

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
      <Typography variant="h4" component="h4" sx={{ marginBottom: 20 + "px" }}>
        Изменение резервации
      </Typography>
      <RangePicker rangeDates={rangeDates} />
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
  range: calendarSelectors.getRange(state),
  editedRange: calendarSelectors.getEditedRange(state),
});
const mapDispatchToProps = (dispatch) => ({
  updateReservation: (data) =>
    dispatch(calendarOperations.updateReservation(data)),
  deleteReservation: (id) => dispatch(calendarOperations.deleteReservation(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReservationsEdit);
