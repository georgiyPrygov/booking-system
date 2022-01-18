import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import RoomSelect from "../../components/RoomSelect/RoomSelect";
import authSelectors from "../../redux/auth/authSelectors";
import { connect } from "react-redux";
import calendarOperations from "../../redux/calendar/calendarOperations";
import BookingsList from "./components/BookingsList/BookingsList";

const Dashboard = ({ getReservations, userId, isAuthenticated }) => {
  useEffect(() => {
    if (isAuthenticated) {
      getReservations({ userId, isAdmin: true });
    }
  }, [isAuthenticated, getReservations, userId]);

  return (
    <Container>
      <Box>
        <h1>Выберите тип комнаты</h1>
      </Box>
      <RoomSelect />
      {userId !== null && <BookingsList />}
    </Container>
  );
};
const mapStateToProps = (state) => ({
  userId: authSelectors.getUserId(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state)
});
const mapDispatchToProps = (dispatch) => ({
  getReservations: (userId) =>
    dispatch(calendarOperations.getReservations(userId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
