import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./BookingPage.scss";
import calendarOperations from "../redux/calendar/calendarOperations";
import calendarSelectors from "../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import moment from "moment";
import authSelectors from "../redux/auth/authSelectors";

const BookingPage = ({ addReservation, reservations, getReservations, isAuthenticated }) => {
  const { id } = useParams();
  const rangeInitialState = { from: null, to: null };
  const [rangeState, setRange] = useState(rangeInitialState);
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const modifiers = { start: rangeState.from, end: rangeState.to };

  useEffect(() => {

    if(!isAuthenticated) {
      getReservations({ userId: "61aa52470f00a54463f6efa8", roomType: id });
    }

    switch (id) {
      case "standard":
        setAvailableAmount(1);
        break;
      case "luxe":
        setAvailableAmount(2);
        break;
      case "deluxe":
        setAvailableAmount(3);
        break;
    }
  }, [isAuthenticated, getReservations, id]);

  useEffect(() => {
    const disabledDates = [];
    for (let i = 0; i < reservations.length; i++) {
      const filtered = reservations.filter((item) => {
        return item.start === reservations[i].start;
      });

      if (filtered.length >= availableAmount) {
        disabledDates.push(new Date(reservations[i].start), {
          after: new Date(reservations[i].start),
          before: new Date(reservations[i].end),
        });
      }
    }
    disabledDates.push({ before: new Date() });
    setDisabledDays(disabledDates);
    setBookedDay(disabledDates);
  }, [reservations]);

  useEffect(() => {
    if (rangeState.from)
      setBookedDay([{ after: nextDisabled, before: rangeState.from }]);
  }, [rangeState, nextDisabled]);

  useEffect(() => {
    setBookedDay(disabledDays);
  }, [rangeState.to]);

  useEffect(() => {
    setIsLoaded(true);
  }, [bookedDays]);

  const handleDayClick = (day, { disabled }) => {

    day = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    if (disabled) {
      handleResetClick();
      return;
    }

    setRange(rangeInitialState);

    for (let j = 0; j < bookedDays.length; j++) {
      if (bookedDays[j] > day) {
        setNextDisabled(bookedDays[j]);
      }
    }
    const range = DateUtils.addDayToRange(day, rangeState);

    if (rangeState.from === null || rangeState.to === null) {
      setRange(range);
    }
  };

  const handleResetClick = () => {
    setBookedDay(disabledDays);
  };

  const handleSubmit = () => {
    const reservation = {
      name: "test",
      email: "test@mail.ru",
      descr: "test",
      phone: 'test',
      start: moment(rangeState.from).format("YYYY-MM-DD"),
      end: moment(rangeState.to).format("YYYY-MM-DD"),
      title: "test",
      owner: "61aa52470f00a54463f6efa8",
      roomType: id,
      roomPrice: 1300
    };
    addReservation(reservation);
    setRange(rangeInitialState);
  };

  return (
    <div className="row">
      {isLoaded ? (
        <>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            fromMonth={new Date()}
            disabledDays={bookedDays !== null ? bookedDays : disabledDays}
            selectedDays={rangeState}
            modifiers={modifiers}
            onDayClick={handleDayClick}
          />
          <button onClick={handleSubmit} className="btn">
            Submit
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
