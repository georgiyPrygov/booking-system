import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import { Box, IconButton, Icon, Typography } from "@mui/material";
import calendarOperations from "../../../redux/calendar/calendarOperations";
import './GuestsCounter.scss';

const GuestsCounter = ({ guests, setGuests }) => {
  const incrementCounter = (e) => {
    const name = e.target.getAttribute("name");
    setGuests({ ...guests, [name]: guests[name] + 1 });
  };
  const decrementCounter = (e) => {
    const name = e.target.getAttribute("name");

    if( name === 'adult' && guests.adult !== 1) {
        setGuests({ ...guests, [name]: guests[name] - 1 });
    }
    if( name === 'children' && guests.children > 0) {
        setGuests({ ...guests, [name]: guests[name] - 1 });
    }
  };

//   useEffect(() => {
//       setGuests(guestsAmount);
//   }, [setGuests, guestsAmount]);

  return (
    <div className="add-guests-counter">
      <Box className="guests-counter-item">
          <Typography variant="span" component="span" className="guests-label">
                Дорослих
          </Typography>
        <IconButton
          className="minus"
          aria-label="minus"
          onClick={(e) => decrementCounter(e)}
        >
          <Icon name="adult">remove</Icon>
        </IconButton>
        <span className="guests-value">{guests.adult}</span>
        <IconButton
          className="plus"
          aria-label="plus"
          onClick={(e) => incrementCounter(e)}
        >
          <Icon name="adult">add</Icon>
        </IconButton>
      </Box>
      <Box className="guests-counter-item">
      <Typography variant="span" component="span" className="guests-label">
                Дітей
          </Typography>
        <IconButton
          className="minus"
          aria-label="minus"
          onClick={(e) => decrementCounter(e)}
        >
          <Icon name="children">remove</Icon>
        </IconButton>
        <span className="guests-value">{guests.children}</span>
        <IconButton
          className="plus"
          aria-label="plus"
          onClick={(e) => incrementCounter(e)}
        >
          <Icon name="children">add</Icon>
        </IconButton>
      </Box>
    </div>
  );
};
const mapStateToProps = (state) => ({
  guests: calendarSelectors.getGuests(state),
});
const mapDispatchToProps = (dispatch) => ({
  setGuests: (obj) => dispatch(calendarOperations.setGuests(obj)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GuestsCounter);
