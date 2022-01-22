import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'moment-timezone';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { connect } from "react-redux";
import authSelectors from "../../redux/auth/authSelectors";
import calendarOperations from "../../redux/calendar/calendarOperations";
import calendarSelectors from "../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import RoomSelect from "../../components/RoomSelect/RoomSelect";
import { Container, Box } from "@mui/material";
import "./CalendarPage.scss";
import snackbarOperations from "../../redux/snackbar/snackbarOperations";
import ReservationsList from "./components/ReservationsList";
import ReservationAdd from "./components/ReservationAdd";
require("moment/locale/uk.js");
require('moment-timezone');

const CalendarPage = ({
  userId,
  getReservations,
  reservations,
  setRange,
  range,
  reservationsState,
}) => {
  const { id } = useParams();
  const localizer = momentLocalizer(moment);
  useEffect(() => {
    getReservations({ userId, roomType: id, isAdmin: true });
  }, [reservationsState, id, userId, getReservations]);

  const handleSelect = ({start, end }) => {

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (moment(start).tz("Europe/Kiev").format() < today) {
      return false;
    } else {
      setRange({ start: moment(start).tz("Europe/Kiev").format(), end: moment(end).tz("Europe/Kiev").format() });
    }
  };

  const eventProps = function (event) {
    let backgroundColor = "#1976d2";
    if (event.paymentStatus === false) {
      backgroundColor = "#eb0000";
    }
    let style = {
      backgroundColor: backgroundColor,
    };
    return {
      style: style,
    };
  };
  const calendarStyle = (day) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let backgroundColor;
    if (day > today && day !== today) {
      backgroundColor = "white";
    }
    if (day < today) {
      backgroundColor = "#e5e5e5";
    }
    if(moment(day).isBetween(
      moment(range.start),
      moment(range.end),
      undefined,
      "[)"
    )) {
      backgroundColor = "#eaf6ff";
    }
    return {
      style: {
        backgroundColor: backgroundColor,
      },
    };
  };

  

  return (
    <Container>
      <Box className="calendar-top-block">
        <h1>Календарь</h1>
        <RoomSelect />
      </Box>
      <div className="calendar-grid">
        <Calendar
          style={{ height: 700 + "px" }}
          selectable
          localizer={localizer}
          events={reservations}
          defaultView={Views.MONTH}
          onSelectEvent={handleSelect}
          onSelectSlot={handleSelect}
          eventPropGetter={eventProps}
          dayPropGetter={calendarStyle}
        />
        <div className="calendar-sidebar">
          <div className="calendar-sidebar-content">
            {range !== null && range.start !== range.end && (
              <>
                <ReservationsList />
                <ReservationAdd />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  userId: authSelectors.getUserId(state),
  range: calendarSelectors.getRange(state),
  reservationsState: calendarSelectors.getReservationsState(state),
});
const mapDispatchToProps = (dispatch) => ({
  getReservations: (userId) =>
    dispatch(calendarOperations.getReservations(userId)),
  setRange: (e) => dispatch(calendarOperations.setRange(e)),
  snackbarRun: (e) => dispatch(snackbarOperations.snackbarRun(e)),
  setIsOpened: (e) => dispatch(snackbarOperations.setIsOpened(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
