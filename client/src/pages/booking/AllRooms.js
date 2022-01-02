import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./BookingPage.scss";
import calendarOperations from "../../redux/calendar/calendarOperations";
import calendarSelectors from "../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import moment from "moment";
import authSelectors from "../../redux/auth/authSelectors";
import localization from "../../utils/localization";
import roomsData from "../../utils/roomsData";
import access from "../../utils/calendarAccess";
import RoomsList from "./components/RoomsList/RoomsList";
import { Button } from "@mui/material";
import GuestsCounter from "./components/GuestsCounter";

const AllRooms = ({
  reservations,
  getReservations,
  isAuthenticated,
  setBookingRange,
  bookingRange,
  guests
}) => {
  const { id } = useParams();
  const datesPicker = useRef();
  const guestsPicker = useRef();
  const [rangeState, setRange] = useState({ from: null, to: null });
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const [nightsCount, setNightsCount] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [calendarState, setCalendarState] = useState(false);
  const [guestsState, setGuestsState] = useState(false)

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
        setRoomPrice(roomsData.standard.price);
        break;
      case "luxe":
        setAvailableAmount(roomsData.luxe.amount);
        setRoomPrice(roomsData.luxe.price);
        break;
      case "deluxe":
        setAvailableAmount(roomsData.deluxe.amount);
        setRoomPrice(roomsData.deluxe.price);
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
      const oneDay = 24 * 60 * 60 * 1000;

      const diffDays = Math.round(
        Math.abs((rangeState.from - rangeState.to) / oneDay)
      );
      setNightsCount(diffDays);

      const getRoomsFormDates = reservations.filter((item) => {
        return (
          moment(rangeState.from).isBetween(
            moment(item.start),
            moment(item.end),
            undefined,
            "[]"
          ) &&
          moment(rangeState.to).isBetween(
            moment(item.start),
            moment(item.end),
            undefined,
            "[]"
          )
        );
      });
      console.log(getRoomsFormDates);
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
      setCalendarState(false);
      setBookingRange(rangeState)
    }
  }, [rangeState.to]);

  useEffect(() => {
    setIsLoaded(true);
  }, [bookedDays]);

  useEffect(() => {
    setRange(bookingRange)
  },[bookingRange])

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if(datesPicker.current) {
          if(calendarState && !datesPicker.current.contains(e.target)) {
            setCalendarState(false)
            setGuestsState(false)
          }
      }
      if(guestsPicker.current) {
        if(guestsState && !guestsPicker.current.contains(e.target)) {
          setCalendarState(false)
          setGuestsState(false)
        }
      }
    }

    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [calendarState, guestsState])

  const handleDayClick = (day, { disabled }) => {
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    if (disabled) {
      handleResetClick();
      return;
    }

    setRange({ from: null, to: null });

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
    <div className="view-container">
      {isLoaded ? (
        <>
        <div className="booking-main-title">
          Перевірте доступність номерів</div>
          <div className="booking-dates-line">
            <div className="choose-dates-label">
            Виберіть дати
            </div>
            <div className={`dates-container ${calendarState ? "opened" : ""}`} ref={datesPicker}>
              <Button
                variant={rangeState.to !== null ? 'contained' : 'outlined'}
                className="primary-btn"
                onClick={() =>
                  setCalendarState((calendarState) => !calendarState)
                }
              >
                {rangeState.from !== null && rangeState.to !== null
                  ? `${moment(rangeState.from).format("DD.MM.YY")} - ${moment(
                      rangeState.to
                    ).format("DD.MM.YY")}`
                  : "Заїзд - Виїзд"}
              </Button>
              <div className="dates-calendar">
                <DayPicker
                  mode="range"
                  locale="ua"
                  months={localization.MONTHS}
                  weekdaysLong={localization.WEEKDAYS_LONG}
                  weekdaysShort={localization.WEEKDAYS_SHORT}
                  numberOfMonths={2}
                  fromMonth={new Date()}
                  disabledDays={bookedDays !== null ? bookedDays : disabledDays}
                  selectedDays={rangeState}
                  modifiers={modifiers}
                  onDayClick={handleDayClick}
                />
                <div className="actions-block">
                   <Button variant="text" color="error" onClick={() => setCalendarState(false)}>Закрити</Button>
                   <Button variant="text" onClick={() => setCalendarState(false)}>Підтвердити</Button>
                </div>
              </div>
            </div>
            <div className={`guests-container ${guestsState ? "opened" : ""}`} ref={guestsPicker}>
              <Button
                variant="contained"
                className="primary-btn"
                onClick={() =>
                  setGuestsState((guestsState) => !guestsState)
                }
              >
                {((guests.adult + guests.children) === 1) ? `${guests.adult + guests.children} гость`: `${guests.adult + guests.children} гостей` }
              </Button>
              <div className="guests-calendar">
                  <GuestsCounter/>
                  <div className="actions-block">
                   <Button variant="text" color="error" onClick={() => setGuestsState(false)}>Закрити</Button>
                   <Button variant="text" onClick={() => setGuestsState(false)}>Підтвердити</Button>
                </div>
              </div>
            </div>
          </div>

          <RoomsList availableRooms={availableRooms} rangeState={rangeState} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
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
    setBookingRange: (data) =>
    dispatch(calendarOperations.setBookingRange(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AllRooms);
