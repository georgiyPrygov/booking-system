import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import { useParams } from "react-router";
import moment from "moment";
import localization from "../../../../utils/localization";
import roomsData from "../../../../utils/roomsData";
import access from "../../../../utils/calendarAccess";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import authSelectors from "../../../../redux/auth/authSelectors";
import calendarOperations from "../../../../redux/calendar/calendarOperations";
import "./DatePick.scss";

const DatePick = ({
  reservations,
  getReservations,
  isAuthenticated,
  setBookingRange,
  bookingRange,
  setAvailableRooms,
  setDatePickerState,
  datePickerState,
  guests
}) => {
  const { id } = useParams();
  const [rangeState, setRange] = useState({ from: null, to: null });
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);

  const modifiers = { start: rangeState.from, end: rangeState.to };

  useEffect(() => {
    if (id !== undefined) {
      setAvailableAmount(roomsData[id].amount);
    } else {
      setAvailableAmount(Object.keys(roomsData).length);
    }
  }, [isAuthenticated, getReservations, id]);

  useEffect(() => {
    if (datePickerState || window.location.href.indexOf("room") !== -1) {
      getReservations({
        userId: access.USER_ID,
        isAdmin: false,
        roomType: id ? id : "",
      });
    }
  }, [datePickerState]);

  useEffect(() => {
    const disabledDates = [];

    for (let i = 0; i < reservations.length; i++) {
      const filtered = reservations.filter((item) => {
        return reservations[i].start === item.start;
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
  }, [reservations, availableAmount]);

  useEffect(() => {
    if (rangeState.from !== null) {
      setBookedDay([{ after: nextDisabled, before: rangeState.from }]);
    }
  }, [rangeState, nextDisabled]);

  useEffect(() => {
    if (rangeState.to !== null) {
      setBookedDay(disabledDays);

      if (id === undefined) {
        const getRoomsFormDates = reservations.filter((item) => {
          return (
            moment(item.start).isBetween(
              moment(rangeState.from),
              moment(rangeState.to),
              undefined,
              "[)"
            ) ||
            moment(item.end).isBetween(
              moment(rangeState.from),
              moment(rangeState.to),
              undefined,
              "()"
            )
          );
        });
        const openedRooms = Object.entries(roomsData).reduce(
          (a, item) => ({ ...a, [item[0]]: item[1].amount }),
          {}
        );
        for (let j = 0; j < getRoomsFormDates.length; j++) {
          if (openedRooms[getRoomsFormDates[j].roomType] !== 0) {
            openedRooms[getRoomsFormDates[j].roomType] =
              openedRooms[getRoomsFormDates[j].roomType] - 1;
          }
        }

        if(guests.adult + guests.children > 2) {
          openedRooms.standard = 0
        }

        setAvailableRooms(openedRooms);
      }
      setBookingRange(rangeState);
      setDatePickerState(false);
    }
    if (rangeState.to === null) {
      setBookingRange({ from: null, to: null });
    }
  }, [rangeState.to, guests]);

  useEffect(() => {
    if (bookingRange.from !== null) {
      setRange(bookingRange);
    }
  }, [bookingRange]);

  const handleDayClick = (day, { disabled }) => {
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    if (disabled) {
      handleResetClick();
      setRange({ from: null, to: null });
      return;
    }

    setRange({ from: null, to: null });

    const sameDay = DateUtils.isSameDay(day, rangeState.from);

    if (sameDay) {
      handleResetClick();
      return;
    }

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

  return (
    <>
      <DayPicker
        mode="range"
        locale="ua"
        months={localization.MONTHS}
        weekdaysLong={localization.WEEKDAYS_LONG}
        weekdaysShort={localization.WEEKDAYS_SHORT}
        numberOfMonths={2}
        month={bookingRange.to !== null ? bookingRange.from : new Date()}
        fromMonth={new Date()}
        disabledDays={bookedDays !== null ? bookedDays : disabledDays}
        selectedDays={rangeState}
        modifiers={modifiers}
        onDayClick={handleDayClick}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  bookingRange: calendarSelectors.getBookingRange(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state),
  guests: calendarSelectors.getGuests(state),
  datePickerState: calendarSelectors.getDatePickerState(state),
});
const mapDispatchToProps = (dispatch) => ({
  getReservations: (userId) =>
    dispatch(calendarOperations.getReservations(userId)),
  setBookingRange: (data) => dispatch(calendarOperations.setBookingRange(data)),
  setAvailableRooms: (data) =>
    dispatch(calendarOperations.setAvailableRooms(data)),
  setDatePickerState: (data) =>
    dispatch(calendarOperations.setDatePickerState(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DatePick);
