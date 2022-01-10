import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import { Box, IconButton, Icon, Typography } from "@mui/material";
import calendarOperations from "../../../../redux/calendar/calendarOperations";
import "./GuestsCounter.scss";
import { useParams } from "react-router";

const GuestsCounter = ({ guests, setGuests }) => {
    const { id } = useParams();
  const [disaclaimerState, setDisclaimerState] = useState(false);
  const [disableState, setDisableState] = useState(false);
  const incrementCounter = (e) => {
    const name = e.target.getAttribute("name");
    setGuests({ ...guests, [name]: guests[name] + 1 });
  };
  const decrementCounter = (e) => {
    const name = e.target.getAttribute("name");

    if (name === "adult" && guests.adult !== 1) {
      setGuests({ ...guests, [name]: guests[name] - 1 });
    }
    if (name === "children" && guests.children > 0) {
      setGuests({ ...guests, [name]: guests[name] - 1 });
    }
  };

  useEffect(() => {
    if((guests.adult + guests.children) > 3) {
        setDisclaimerState(true)
    } else {
        setDisclaimerState(false)
    }

    if((guests.adult + guests.children) >= 2 && id === 'standard') {
        setDisableState(true)
    } else {
        setDisableState(false)
    }
  },[guests])

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
          disabled={disableState}
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
          disabled={disableState}
        >
          <Icon name="children">add</Icon>
        </IconButton>
      </Box>
      {disaclaimerState && (
        <div className="counter-disclaimer">
          Плануєте поїздку на більше ніж 3 гостей, вам будуть потрібні мінімум 2
          номери. Зв'яжіться з нами за телефоном:<br/>
          <a href="tel:+380971914806" className="phone-link">
            +38 (097) 191 48 06
          </a>
        </div>
      )}
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
