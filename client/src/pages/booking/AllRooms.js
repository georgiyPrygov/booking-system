import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import "react-day-picker/lib/style.css";
import "./AllRooms.scss";
import calendarOperations from "../../redux/calendar/calendarOperations";
import calendarSelectors from "../../redux/calendar/calendarSelectors";
import moment from "moment";
import RoomsList from "./components/RoomsList/RoomsList";
import { Button } from "@mui/material";
import GuestsCounter from "./components/GuestsCounter/GuestsCounter";
import DatePick from "./components/DatePick/DatePick";

const AllRooms = ({
  bookingRange,
  guests,
  datePickerState,
  setDatePickerState,
}) => {
  const datesPicker = useRef();
  const guestsPicker = useRef();
  const [guestsState, setGuestsState] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (datesPicker.current) {
        if (datePickerState && !datesPicker.current.contains(e.target)) {
          setDatePickerState(false);
          setGuestsState(false);
        }
      }
      if (guestsPicker.current) {
        if (guestsState && !guestsPicker.current.contains(e.target)) {
          setDatePickerState(false);
          setGuestsState(false);
        }
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [datePickerState, guestsState]);

  return (
    <div className="view-container">
      <>
        <div className="booking-main-title">Перевірте доступність номерів</div>
        <div className="booking-dates-line">
          <div className="choose-dates-label">Виберіть дати</div>
          <div
            className={`dates-container ${datePickerState ? "opened" : ""}`}
            ref={datesPicker}
          >
            <Button
              variant={bookingRange.to !== null ? "contained" : "outlined"}
              className="primary-btn"
              onClick={() =>
                setDatePickerState((datePickerState) => !datePickerState)
              }
            >
              {bookingRange.from !== null && bookingRange.to !== null
                ? `${moment(bookingRange.from).format("DD.MM.YY")} - ${moment(
                    bookingRange.to
                  ).format("DD.MM.YY")}`
                : "Заїзд - Виїзд"}
            </Button>
            <div className="dates-calendar">
              <DatePick />
              <div className="actions-block">
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setDatePickerState(false)}
                >
                  Закрити
                </Button>
                <Button
                  variant="text"
                  onClick={() => setDatePickerState(false)}
                >
                  Підтвердити
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`guests-container ${guestsState ? "opened" : ""}`}
            ref={guestsPicker}
          >
            <Button
              variant="contained"
              className="primary-btn"
              onClick={() => setGuestsState((guestsState) => !guestsState)}
            >
              {guests.adult + guests.children === 1
                ? `${guests.adult + guests.children} гость`
                : `${guests.adult + guests.children} гостей`}
            </Button>
            <div className="guests-calendar">
              <GuestsCounter />
              <div className="actions-block">
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setGuestsState(false)}
                >
                  Закрити
                </Button>
                <Button variant="text" onClick={() => setGuestsState(false)}>
                  Підтвердити
                </Button>
              </div>
            </div>
          </div>
        </div>

        <RoomsList />
      </>
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookingRange: calendarSelectors.getBookingRange(state),
  guests: calendarSelectors.getGuests(state),
  datePickerState: calendarSelectors.getDatePickerState(state),
});
const mapDispatchToProps = (dispatch) => ({
  setDatePickerState: (data) =>
    dispatch(calendarOperations.setDatePickerState(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AllRooms);
