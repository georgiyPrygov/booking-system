import React, { useState, useEffect } from "react";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { connect } from "react-redux";
import calendarSelectors from "../../redux/calendar/calendarSelectors";
import RoomSelect from "../../components/RoomSelect/RoomSelect";
import { Container, Box } from "@mui/material";
import "./CalendarPage.scss";
import ReservationsList from "./components/ReservationsList";
import ReservationAdd from "./components/ReservationAdd";
import Scheduler from "./components/Scheduler";
import {currentTimezone} from './components/utils/dateUtils';

const CalendarPage = ({
  reservations,
  range,
}) => {

  const now = () => new Date();
  return (
    <Container>
      <Box className="calendar-top-block">
        <h1>Календарь</h1>
        <RoomSelect />
      </Box>
      <div className="calendar-grid">
        
        <Scheduler timezone={currentTimezone} now={now} events={reservations}/>
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
  range: calendarSelectors.getRange(state),
});


export default connect(mapStateToProps, null)(CalendarPage);
