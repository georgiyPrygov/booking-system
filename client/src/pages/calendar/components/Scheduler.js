import React, { useEffect, useState } from 'react';
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import {
  currentTimezone,
  getMoment,
  dateRangeHeaderFormat,
  getNow,
  getTimeAsDate
} from './utils/dateUtils';
// this converts my date strings to JS Date objects (local time)
import useNormalizedDates from './utils/useNormalizedDates.hook';
import moment from 'moment'
import { connect } from 'react-redux';
import calendarSelectors from '../../../redux/calendar/calendarSelectors';
import authSelectors from '../../../redux/auth/authSelectors';
import calendarOperations from '../../../redux/calendar/calendarOperations';
import snackbarOperations from '../../../redux/snackbar/snackbarOperations';
import { useParams } from 'react-router';
require("moment/locale/uk.js");

let formats = {
  dateFormat: 'DD',
  dayFormat: 'ddd MM/DD/YYYY',
  monthHeaderFormat: 'MMMM, YYYY',
  dayRangeHeaderFormat: dateRangeHeaderFormat,
  dayHeaderFormat: 'dddd, MMMM DD, YYYY'
};

const views = [Views.MONTH];


const Scheduler = ({
    userId,
  getReservations,
  reservations,
  setRange,
  range,
  reservationsState,
  timezone = currentTimezone,
  now,
  events = [],
  ...props
}) => {
  const [calEvents, setCalEvents] = useState([]);
  useNormalizedDates(events, setCalEvents);

  const localizer = momentLocalizer(moment);
  const { id } = useParams();
  useEffect(() => {
    getReservations({ userId, roomType: id, isAdmin: true });
  }, [reservationsState, id, userId, getReservations]);


  const handleSelect = ({ start, end }) => {
    let today = moment()
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .format();

    if (moment(start).format() < today) {
      return false;
    } else {
      setRange({
        start: moment(start)
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
        end: moment(end)
          .set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .format(),
      });
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
    let today = moment()
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toDate();

    let backgroundColor;
    if (day > today && day !== today) {
      backgroundColor = "white";
    }
    if (day < today) {
      backgroundColor = "#e5e5e5";
    }
    if (
      moment(day).isBetween(
        moment(range.start),
        moment(range.end),
        undefined,
        "[)"
      )
    ) {
      backgroundColor = "#eaf6ff";
    }
    return {
      style: {
        backgroundColor: backgroundColor,
      },
    };
  };
  return (
    <div className="scheduler-container">
      <Calendar
      style={{ height: 700 + "px" }}
        localizer={localizer}
        formats={formats}
        events={calEvents}
        views={views}
        defaultView={Views.MONTH}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        getNow={() => getNow(now, moment)}
        min={getTimeAsDate(7, moment)}
        max={getTimeAsDate(18, moment)}
        onSelectEvent={handleSelect}
        onSelectSlot={handleSelect}
        eventPropGetter={eventProps}
        dayPropGetter={calendarStyle}
        selectable
      />
    </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
