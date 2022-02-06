import React, { useEffect, useRef, useState } from "react";
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
import { createHmac } from "crypto";

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
  const [merchantSign, setMerchantSign] = useState({
    merchantAccount: "booking_agora_chalet_com",
    merchantDomainName: "booking.agora-chalet.com",
    orderReference: `BK${Date.now()}`,
    orderDate: Math.round(Date.now()),
    amount: `10`,
    currency: "UAH",
    productName: `Передплата за номер ${roomsData[id].category}`,
    productCount: "1",
    productPrice: "10",
  });
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const paramsDates = {
    from: new Date(searchParams.get("checkin")),
    to: new Date(searchParams.get("checkout")),
  };

  useEffect(() => {
    setAvailableAmount(roomsData[id].amount);

    const scriptTag = document.createElement("script");
    scriptTag.src = "https://secure.wayforpay.com/server/pay-widget.js";
    document.body.appendChild(scriptTag);
  }, []);


  var wayforpay = new window.Wayforpay();
  var pay = function () {
    wayforpay.run(
      { ...paymentData },
      function (response) {
        // on approved
        setPaymentStatus('success')
      },
      function (response) {
        // on declined
        setPaymentStatus('declined')
      },
      function (response) {
        // on pending or in processing
        setPaymentStatus('success')
      }
    );
  };

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
        pay()
      } else {
        setIsConfirmed(false);
      }
    }
  }, [bookingValid]);

  useEffect(() => {
    if(paymentStatus !== null) {
      if(paymentStatus === 'success') {
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
          guests: searchParams.get("guests"),
          paymentStatus: false,
          bookingDate: new Date(),
          isAdmin: false,
        });
        setStateBeforeSumbit(null);
        setIsConfirmed(null);
        setBookingRange({ from: null, to: null });
        navigate(`${window.location.search}&success=true`);
      }
      if(paymentStatus === 'declined') {
        setStateBeforeSumbit(null);
        setIsConfirmed(null);
        setBookingValid(null);
      }
    }
  },[paymentStatus])

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

  const hmacmd5 = (string, secret = "123456") => {
    const hash = createHmac("md5", secret)
      .update(string + "")
      .digest("hex");
    setPaymentData({ ...paymentData, ...merchantSign, merchantSignature: hash });
  };

  useEffect(() => {
    const paymentString = Object.keys(merchantSign).reduce((acc, idx) => {
      return Object.keys(merchantSign).indexOf(idx) ===
        Object.keys(merchantSign).length - 1
        ? acc + merchantSign[idx]
        : acc + `${merchantSign[idx]};`;
    }, "");
    const secretKey = process.env.REACT_APP_WAYFORPAY_SECRET;
    hmacmd5(paymentString, secretKey);
  }, [merchantSign]);

  window.addEventListener("message", function (e) {
    if (e.data == 'WfpWidgetEventClose') {
    setMerchantSign({...merchantSign, orderReference: `BK${Date.now()}`})
    setStateBeforeSumbit(null);
    setIsConfirmed(null);
    setBookingValid(null);
    }
    }, false);

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
    totalPrice: null,
    guests: searchParams.get("guests"),
    nightsCount: null,
    bookingDate: new Date(),
    notAdmin: true,
  });

  useEffect(() => {
    if (paramsDates.to !== null) {
      const oneDay = 24 * 60 * 60 * 1000;

      const diffDays = Math.round(
        Math.abs((paramsDates.from - paramsDates.to) / oneDay)
      );
      setForm({
        ...form,
        nightsCount: diffDays,
        totalPrice: form.nightsCount * form.roomPrice,
      });
    }
  }, [form.nightsCount]);

  const changeHandler = (e) => {
    if (e.target.name === "name") {
      setForm({
        ...form,
        name: e.target.value,
        title: e.target.value,
      });
      setPaymentData({...paymentData, clientFirstName: e.target.value, clientLastName: e.target.value})
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    if (e.target.name === "paymentStatus") {
      setForm({ ...form, paymentStatus: e.target.checked });
    }
    if (e.target.name === "email") {
      setPaymentData({...paymentData, clientEmail: e.target.value})
    }
    if (e.target.name === "phone") {
      setPaymentData({...paymentData, clientPhone: `38${e.target.value}`, language: 'UA'})
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
