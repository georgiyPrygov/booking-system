import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import calendarOperations from "../../../../redux/calendar/calendarOperations";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import moment from "moment";
import authSelectors from "../../../../redux/auth/authSelectors";
import localization from "../../../../utils/localization";
import roomsData from "../../../../utils/roomsData";
import access from "../../../../utils/calendarAccess";
import { NavLink } from "react-router-dom";

const RoomDetails = ({
  reservations,
  getReservations,
  isAuthenticated,
  bookingRange,
}) => {
  const { id } = useParams();
  const rangeInitialState = { from: null, to: null };
  const [rangeState, setRange] = useState(rangeInitialState);
  const [nextDisabled, setNextDisabled] = useState(null);
  const [disabledDays, setDisabledDays] = useState(null);
  const [bookedDays, setBookedDay] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const [nightsCount, setNightsCount] = useState(0);

  const modifiers = { start: rangeState.from, end: rangeState.to };

  useEffect(() => {
    setRange(bookingRange);
  }, [bookingRange]);

  useEffect(() => {
    if (!isAuthenticated) {
      getReservations({
        userId: access.USER_ID,
        roomType: id,
        isAdmin: false,
      });
    }

    switch (id) {
      case "standard":
        setAvailableAmount(roomsData.STANDARD.amount);
        setRoomPrice(roomsData.STANDARD.price);
        break;
      case "luxe":
        setAvailableAmount(roomsData.LUXE.amount);
        setRoomPrice(roomsData.LUXE.price);
        break;
      case "deluxe":
        setAvailableAmount(roomsData.DELUXE.amount);
        setRoomPrice(roomsData.DELUXE.price);
        break;
    }
  }, [isAuthenticated, getReservations, id]);

  useEffect(() => {
    const disabledDates = [];
    for (let i = 0; i < reservations.length; i++) {
      const filtered = reservations.filter((item) => {
        return item.start === reservations[i].start;
      });

      console.log(filtered.length);

      if (filtered.length >= availableAmount) {
        disabledDates.push(new Date(reservations[i].start), {
          after: new Date(reservations[i].start),
          before: new Date(reservations[i].end),
        });
      }
    }
    disabledDates.push({ before: new Date() });
    setDisabledDays(disabledDates);
    setBookedDay(disabledDates);
  }, [reservations]);

  useEffect(() => {
    if (rangeState.from)
      setBookedDay([{ after: nextDisabled, before: rangeState.from }]);
  }, [rangeState, nextDisabled]);

  useEffect(() => {
    setBookedDay(disabledDays);
    const oneDay = 24 * 60 * 60 * 1000;

    const diffDays = Math.round(
      Math.abs((rangeState.from - rangeState.to) / oneDay)
    );
    setNightsCount(diffDays);
  }, [rangeState.to]);
  useEffect(() => {
    setIsLoaded(true);
  }, [bookedDays]);


  const handleDayClick = (day, { disabled }) => {
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
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
    <div className="view-container">
      {isLoaded ? (
        <>
          <DayPicker
            mode="range"
            locale="ua"
            months={localization.MONTHS}
            weekdaysLong={localization.WEEKDAYS_LONG}
            weekdaysShort={localization.WEEKDAYS_SHORT}
            numberOfMonths={2}
            fromMonth={new Date()}
            disabledDays={bookedDays !== null ? bookedDays : disabledDays}
            selectedDays={rangeState}
            modifiers={modifiers}
            onDayClick={handleDayClick}
          />
          <div className="preview-col">
            <div className="preview-block">
              <div className="dates">
                <div className="arrival">
                  <div className="label">Дата заїзду</div>
                  <div className="value">
                    {rangeState.from !== null
                      ? moment(rangeState.from).format("DD.MM.YY")
                      : "Виберіть дату"}
                  </div>
                </div>
                <div className="arrival">
                  <div className="label">Дата виїзду</div>
                  <div className="value">
                    {rangeState.to !== null
                      ? moment(rangeState.to).format("DD.MM.YY")
                      : "Виберіть дату"}
                  </div>
                </div>
              </div>
              {rangeState.to !== null && (
                <div className="pricing-list">
                  <div className="pricing-list-item">
                    <div className="subtotal">
                      {`UAH ${roomPrice} x ${nightsCount} ночі`}
                    </div>
                    <div className="total">
                      {`UAH ${roomPrice * nightsCount}`}
                    </div>
                  </div>
                  <div className="pricing-list-item total-item">
                    <div className="subtotal">Загалом</div>
                    <div className="total">
                      {`UAH ${roomPrice * nightsCount}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {bookingRange.to !== null && (
            <NavLink
              to={`/checkout?checkin=${moment(bookingRange.from).format(
                "DD-MM-YY"
              )}&checkout=${moment(bookingRange.to).format("DD-MM-YY")}`}
            >
              Checkout
            </NavLink>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  bookingRange: calendarSelectors.getBookingRange(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state),
});
const mapDispatchToProps = (dispatch) => ({
  getReservations: (userId) =>
    dispatch(calendarOperations.getReservations(userId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RoomDetails);
