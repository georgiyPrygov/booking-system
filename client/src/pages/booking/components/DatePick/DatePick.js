import React, { useState, useEffect, useRef } from "react";
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
import './DatePick.scss'

const DatePick = ({
  reservations,
  getReservations,
  isAuthenticated,
  setBookingRange,
  bookingRange,
  setAvailableRooms,
  setDatePickerState,
}) => {
  const { id } = useParams();
  const [rangeState, setRange] = useState({ from: null, to: null });
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);

  const modifiers = { start: rangeState.from, end: rangeState.to };

  useEffect(() => {
    if (!isAuthenticated) {
      getReservations({
        userId: access.USER_ID,
        isAdmin: false,
      });
    }

    switch (id) {
      case "standard":
        setAvailableAmount(roomsData.standard.amount);
        break;
      case "luxe":
        setAvailableAmount(roomsData.luxe.amount);
        break;
      case "deluxe":
        setAvailableAmount(roomsData.deluxe.amount);
        break;
      default:
        setAvailableAmount(6);
    }
  }, [isAuthenticated, getReservations, id]);

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

      const getRoomsFormDates = reservations.filter((item) => {
        return (
          moment(rangeState.from).isBetween(
            moment(item.start),
            moment(item.end),
            undefined,
            "[]"
          ) ||
          moment(rangeState.to).isBetween(
            moment(item.start),
            moment(item.end),
            undefined,
            "[]"
          )
        );
      });
      const openedRooms = {
        standard: roomsData.standard.amount,
        luxe: roomsData.luxe.amount,
        deluxe: roomsData.deluxe.amount,
      };
      for (let j = 0; j < getRoomsFormDates.length; j++) {
        if (
          getRoomsFormDates[j].roomType === "standard" &&
          openedRooms.standard !== 0
        ) {
          openedRooms.standard = openedRooms.standard - 1;
        }
        if (
          getRoomsFormDates[j].roomType === "luxe" &&
          openedRooms.luxe !== 0
        ) {
          openedRooms.luxe = openedRooms.luxe - 1;
        }
        if (
          getRoomsFormDates[j].roomType === "deluxe" &&
          openedRooms.deluxe !== 0
        ) {
          openedRooms.deluxe = openedRooms.deluxe - 1;
        }
      }

      setAvailableRooms(openedRooms);
      setBookingRange(rangeState);
      setDatePickerState(false);
    }
    if (rangeState.to === null) {
      setBookingRange({ from: null, to: null });
    }
  }, [rangeState.to]);

  useEffect(() => {
      if(bookingRange.from !== null) {
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
