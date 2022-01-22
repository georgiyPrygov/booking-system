import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import "./RangePicker.scss";
import calendarSelectors from "../../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import calendarOperations from "../../../redux/calendar/calendarOperations";
import localization from "../../../utils/localization";
import roomsData from "../../../utils/roomsData";

const RangePicker = ({reservations, setEditedRange, editedReservation, range}) => {
  const rangeInitialState = { from: null, to: null };
  const [rangeState, setRange] = useState(rangeInitialState);
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const modifiers = { start: rangeState.from, end: rangeState.to };
  const { id } = useParams();
  

  useEffect(() => {
    setAvailableAmount(roomsData[id].amount);
  }, [id]);

  useEffect(() => {
    setEditedRange({from: range.start, to: range.end});
  },[range])


  useEffect(() => {
    if(reservations.length !== 0) {
    const disabledDates = [];
    disabledDates.push({ before: new Date() });
    for (let i = 0; i < reservations.length; i++) {
      const filtered = reservations.filter((item) => {
        return item.start === reservations[i].start && item.start !== editedReservation[0].start;
      });

      if (filtered.length >= availableAmount) {
        disabledDates.push(new Date(reservations[i].start), {
          after: new Date(reservations[i].start),
          before: new Date(reservations[i].end),
        });
      }
    }
    setDisabledDays(disabledDates);
    setBookedDay(disabledDates);
  }
  }, [reservations, availableAmount]);

  useEffect(() => {
    if (rangeState.from)
      setBookedDay([{ after: nextDisabled, before: rangeState.from }]);
  }, [rangeState, nextDisabled]);

  useEffect(() => {
    setBookedDay(disabledDays);
    setEditedRange(rangeState)
  }, [rangeState.to]);

  useEffect(() => {
    setIsLoaded(true);
  }, [bookedDays]);

  const handleDayClick = (day, { disabled }) => {
    day.setHours(0,0,0,0)
    if (disabled) {
      handleResetClick();
      return;
    }

    setRange(rangeInitialState);

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
    <div className="row">
      {isLoaded ? (
        <>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            months={localization.MONTHS}
            weekdaysLong={localization.WEEKDAYS_LONG}
            weekdaysShort={localization.WEEKDAYS_SHORT}
            fromMonth={new Date()}
            disabledDays={bookedDays !== null ? bookedDays : disabledDays}
            selectedDays={rangeState}
            modifiers={modifiers}
            onDayClick={handleDayClick}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  range: calendarSelectors.getRange(state)
});
const mapDispatchToProps = (dispatch) => ({
    setEditedRange: (data) =>
      dispatch(calendarOperations.setEditedRange(data))
  });
export default connect(mapStateToProps, mapDispatchToProps)(RangePicker);
