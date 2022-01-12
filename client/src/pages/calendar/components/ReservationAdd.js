import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import {
  TextField,
  Box,
  CardActions,
  Button,
  Modal,
  IconButton,
  Icon,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import calendarOperations from "../../../redux/calendar/calendarOperations";
import authSelectors from "../../../redux/auth/authSelectors";
import moment from "moment";

const ReservationAdd = ({
  addReservation,
  range,
  userId,
  roomType,
  roomPrice,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    descr: "",
    phone: "",
    start: null,
    end: null,
    title: "",
    owner: userId,
    roomType,
    roomPrice,
    paymentStatus: false,
  });
  const [modalState, setModalState] = useState(false);

  useEffect(() => {
    setForm({ ...form, start: range.start, end: range.end });
  }, [range]);

  const closeModal = () => setModalState(false);

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
    addReservation(form);
    setModalState(false);
  };

  const startCreate = () => {
    setModalState(true);
  };

  return (
    <div className="add-reservation-container">
      <Typography variant="h6" component="h6" sx={{ marginBottom: 6 + "px" }}>
        Выбранные даты
      </Typography>
      <Typography
        variant="p"
        component="p"
        sx={{ marginBottom: 20 + "px" }}
        className="secondary-descr"
      >
        {`${moment(range.start).format("DD.MM.YY")} - ${moment(
          range.end
        ).format("DD.MM.YY")}`}
      </Typography>
      <Button
        fullWidth
        onClick={startCreate}
        variant="contained"
        endIcon={<Icon>add</Icon>}
      >
        Создать бронь
      </Button>
      <Modal open={modalState} onClose={closeModal}>
        <Box className="modal-content">
          <IconButton className="close" aria-label="close" onClick={closeModal}>
            <Icon>close</Icon>
          </IconButton>
          <Typography
            variant="p"
            component="p"
            className="secondary-descr"
            sx={{ marginBottom: 20 + "px" }}
          >
            На даты{" "}
            {`${moment(range.start).format("DD.MM.YY")} - ${moment(
              range.end
            ).format("DD.MM.YY")}`}
          </Typography>
          <Box className="reservation-edit-form">
            <form onSubmit={handleSubmit}>
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
            <Box className="price-and-payment">
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
            <FormControlLabel className="prepayment-checkbox" control={<Checkbox name="paymentStatus" onChange={changeHandler}/>} label="Предоплата" />
            </Box>
            <CardActions className="card-actions">
              <div></div>
              <Button type="submit" variant="contained">
                Подтвердить
              </Button>
            </CardActions>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  range: calendarSelectors.getRange(state),
  userId: authSelectors.getUserId(state),
});
const mapDispatchToProps = (dispatch) => ({
  addReservation: (reservation) =>
    dispatch(calendarOperations.addReservation(reservation)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReservationAdd);
