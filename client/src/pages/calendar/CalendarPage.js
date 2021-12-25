import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { connect } from "react-redux";
import authSelectors from "../../redux/auth/authSelectors";
import calendarOperations from "../../redux/calendar/calendarOperations";
import calendarSelectors from "../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import RoomSelect from "../../components/RoomSelect/RoomSelect";
import { Container, Box, Typography } from "@mui/material";
import "./CalendarPage.scss";
import snackbarOperations from "../../redux/snackbar/snackbarOperations";
import ReservationsList from "./components/ReservationsList";
import ReservationAdd from "./components/ReservationAdd";

const CalendarPage = ({
  userId,
  getReservations,
  reservations,
  addReservation,
  deleteReservation,
  snackbarRun,
  setIsOpened,
  setRange,
  range,
  reservationsState,
}) => {
  const { id } = useParams();
  const localizer = momentLocalizer(moment);

  const [roomPrice, setRoomPrice] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);

  useEffect(() => {
    getReservations({ userId, roomType: id });
    switch (id) {
      case "standard":
        setAvailableAmount(1);
        setRoomPrice(1100);
        break;
      case "luxe":
        setAvailableAmount(2);
        setRoomPrice(1300);
        break;
      case "deluxe":
        setAvailableAmount(3);
        setRoomPrice(1400);
        break;
    }
  }, [reservationsState, id, userId, getReservations]);

  const handleSelect = ({ start, end }) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return false;
    } else {
      setRange({ start, end });
    }

    // if (reservationsForCell.length >= availableAmount) {
    //   setIsOpened(true);
    //   snackbarRun({
    //     message: "Нет свободных номеров на эту дату",
    //     status: "error",
    //   });
    //   return false;
    // }
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
          onSelectEvent={null}
          onSelectSlot={handleSelect}
        />
        <div className="calendar-sidebar">
          {range !== null && (
            <>
              <ReservationsList />
              <ReservationAdd roomPrice={roomPrice} roomType={id} />
            </>
          )}
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
