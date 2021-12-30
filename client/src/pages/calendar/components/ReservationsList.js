import React, { useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import moment from "moment";
import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Typography,
  Icon,
  Modal,
  Box,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import ReservationEdit from "./ReservationEdit";

const ReservationsList = ({ range, reservations }) => {
  const [modalState, setModalState] = useState(false);
  const closeModal = () => setModalState(false);

  const [editedReservation, setEditedReservation] = useState(null);
  const filteredReservations = reservations.filter((item) =>
    moment(range.start).isBetween(
      moment(item.start),
      moment(item.end),
      undefined,
      "[)"
    )
  );

  const startEdit = (id) => {
    const editFiltered = reservations.filter((item) => item._id === id);
    setEditedReservation(editFiltered);
    setModalState(true);
  };

  return (
    <div className="reservations-for-date">
      {filteredReservations.length !== 0 && (
        <Typography variant="h6" component="h6">
          Резервации
        </Typography>
      )}
      {filteredReservations.length !== 0 && (
        <List className="reservations-list">
          {filteredReservations.map((item, id) => {
            return (
              <ListItem
                key={id}
                className="reservations-list-item"
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => startEdit(item._id)}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                }
              >
                                  <ListItemAvatar>
                    <Avatar>
                    <Icon>person</Icon>
                    </Avatar>
                  </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={`${moment(item.start).format(
                    "DD.MM.YY"
                  )} - ${moment(item.end).format("DD.MM.YY")}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
      <Modal open={modalState} onClose={closeModal}>
        <Box className="modal-content">
          <IconButton className="close" aria-label="close" onClick={closeModal}>
            <Icon>close</Icon>
          </IconButton>
          <ReservationEdit
            editedReservation={editedReservation}
            setModalState={setModalState}
          />
        </Box>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  range: calendarSelectors.getRange(state),
});
export default connect(mapStateToProps, null)(ReservationsList);
