import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TextField, Box, CardActions, Button } from "@mui/material";
import moment from "moment";
import calendarSelectors from "../../../../../redux/calendar/calendarSelectors";
import calendarOperations from "../../../../../redux/calendar/calendarOperations";
import calendarAccess from "../../../../../utils/calendarAccess";
import roomsData from "../../../../../utils/roomsData";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import authSelectors from "../../../../../redux/auth/authSelectors";
import snackbarOperations from "../../../../../redux/snackbar/snackbarOperations";

const BookingForm = ({
  addReservation,
  getReservations,
  reservations,
  isAuthenticated,
  snackbarRun,
  setIsOpened,
  setBookingRange,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [availableAmount, setAvailableAmount] = useState(0);
  const [bookingValid, setBookingValid] = useState(null);
  const [stateBeforeSubmit, setStateBeforeSumbit] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(null);

  const paramsDates = {
    from: new Date(searchParams.get("checkin")),
    to: new Date(searchParams.get("checkout")),
  };

  useEffect(() => {
    setAvailableAmount(roomsData[id].amount);
  }, []);

  useEffect(() => {
    const getRoomsFormDates = reservations.filter((item) => {
      return (
        moment(paramsDates.from).isBetween(
          moment(item.start),
          moment(item.end),
          undefined,
          "[)"
        ) ||
        moment(paramsDates.to).isBetween(
          moment(item.start),
          moment(item.end),
          undefined,
          "(]"
        )
      );
    });
    console.log(getRoomsFormDates);
    if (stateBeforeSubmit && isConfirmed === null) {
      if (
        getRoomsFormDates.length >= availableAmount &&
        availableAmount !== 0
      ) {
        setBookingValid(false);
      } else {
        setBookingValid(true);
      }
    }
  }, [reservations]);

  useEffect(() => {
    if (bookingValid !== null) {
      if (bookingValid) {
        addReservation(form);
        setIsConfirmed(true);
        setForm({
          name: "",
          email: "",
          descr: "",
          phone: "",
          start: paramsDates.from,
          end: paramsDates.to,
          title: "",
          owner: calendarAccess.USER_ID,
          roomType: id,
          roomPrice: roomsData[id].price,
          paymentStatus: false,
        });
        setStateBeforeSumbit(null);
        setIsConfirmed(null);
        setBookingRange({ from: null, to: null });
        navigate(`${window.location.search}&success=true`);
      } else {
        setIsConfirmed(false);
      }
    }
  }, [bookingValid]);

  useEffect(() => {
    if (bookingValid !== null && isConfirmed === false) {
      setIsOpened(true);
      snackbarRun({
        message: "На жаль ці дати більше не доступні",
        status: "error",
      });
      navigate(`/room/${id}`);
    }
  }, [bookingValid, isConfirmed]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    descr: "",
    phone: "",
    start: paramsDates.from,
    end: paramsDates.to,
    title: "",
    owner: calendarAccess.USER_ID,
    roomType: id,
    roomPrice: roomsData[id].price,
    paymentStatus: false,
  });

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
    if (e.target.name === "paymentStatus") {
      setForm({ ...form, paymentStatus: e.target.checked });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setStateBeforeSumbit(true);
    if (!isAuthenticated) {
      getReservations({
        userId: calendarAccess.USER_ID,
        isAdmin: false,
        roomType: id,
      });
    }
  };

  return (
    <div className="section form">
      <div className="section-title">Введіть ваші данні</div>
      <form onSubmit={handleSubmit}>
        <Box className="reservation-edit-form">
          <TextField
            required
            id="name"
            label="Ім'я"
            name="name"
            placeholder="Введіть ваше Ім'я"
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
            placeholder="Введіть ваш email на який отримаете підтвердження"
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
            placeholder="Введіть номер за яким ми зможемо з вами зв'язатись"
            onChange={changeHandler}
            value={form.phone}
            fullWidth
            margin="normal"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            id="details"
            label="Додаткова інформація"
            name="descr"
            placeholder="Введіть додаткову інформацію"
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
            <div></div>
            <Button type="submit" variant="contained">
              Підтвердити бронювання
            </Button>
          </CardActions>
        </Box>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state),
});
const mapDispatchToProps = (dispatch) => ({
  addReservation: (reservation) =>
    dispatch(calendarOperations.addReservation(reservation)),
  getReservations: (userId) =>
    dispatch(calendarOperations.getReservations(userId)),
  snackbarRun: (e) => dispatch(snackbarOperations.snackbarRun(e)),
  setIsOpened: (e) => dispatch(snackbarOperations.setIsOpened(e)),
  setBookingRange: (data) => dispatch(calendarOperations.setBookingRange(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);
