import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import calendarOperations from "../../../../../redux/calendar/calendarOperations";
import calendarSelectors from "../../../../../redux/calendar/calendarSelectors";
import { useParams } from "react-router";
import moment from "moment";
import roomsData from "../../../../../utils/roomsData";
import { NavLink } from "react-router-dom";
import "./Subtotal.scss";
import GuestsCounter from "../../GuestsCounter/GuestsCounter";
import DatePick from "../../DatePick/DatePick";
import { Button } from "@mui/material";

const Subtotal = ({
  bookingRange,
  setNightsCount,
  nightsCount,
  guests,
  totalPrice,
  setTotalPrice,
  reservations,
  datePickerState,
  setDatePickerState,
}) => {
  const { id } = useParams();
  const datesPicker = useRef();
  const [roomPrice, setRoomPrice] = useState(0);
  const [pickerTitle, setPickerTitle] = useState("");

  useEffect(() => {
    switch (id) {
      case "standard":
        setRoomPrice(roomsData.standard.price);
        break;
      case "luxe":
        setRoomPrice(roomsData.luxe.price);
        break;
      case "deluxe":
        setRoomPrice(roomsData.deluxe.price);
        break;
      default:
        setRoomPrice(roomsData.standard.price);
    }
  }, [id]);

  useEffect(() => {
    if (bookingRange.to !== null) {
      const oneDay = 24 * 60 * 60 * 1000;

      const diffDays = Math.round(
        Math.abs((bookingRange.from - bookingRange.to) / oneDay)
      );
      setNightsCount(diffDays);
    }
  }, [bookingRange.to]);

  useEffect(() => {
    if (bookingRange.to !== null) {
      if (nightsCount === 1) {
        setPickerTitle("ніч");
      } else if (nightsCount > 1 && nightsCount < 5) {
        setPickerTitle("ночі");
      } else if (nightsCount >= 5) {
        setPickerTitle("ночей");
      }
    }
  }, [bookingRange, nightsCount]);

  useEffect(() => {
    if (guests.adult + guests.children > 2) {
      const counted =
        roomPrice * nightsCount + roomsData[id].extra_cost * nightsCount;
      setTotalPrice(counted);
    } else {
      const counted = roomPrice * nightsCount;
      setTotalPrice(counted);
    }
  }, [guests, bookingRange, nightsCount, reservations]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (datesPicker.current) {
        if (datePickerState && !datesPicker.current.contains(e.target)) {
          setDatePickerState(false);
        }
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [datePickerState]);

  return (
    <div className="subtotal-col">
      <div className="preview-block">
        <div className="dates" onClick={() => setDatePickerState(true)}>
          <div className="arrival">
            <div className="label">Дата заїзду</div>
            <div className="value">
              {bookingRange.from !== null
                ? moment(bookingRange.from).format("DD.MM.YY")
                : "Виберіть дату"}
            </div>
          </div>
          <div className="arrival">
            <div className="label">Дата виїзду</div>
            <div className="value">
              {bookingRange.to !== null
                ? moment(bookingRange.to).format("DD.MM.YY")
                : "Виберіть дату"}
            </div>
            <div
              className={`dates-container ${datePickerState ? "opened" : ""}`}
              ref={datesPicker}
            >
              <div className="dates-calendar">
                <DatePick />
                <div className="actions-block">
                  <Button
                    variant="text"
                    color="error"
                    onClick={(e) => {
                      setDatePickerState(false);
                      e.stopPropagation();
                    }}
                  >
                    Закрити
                  </Button>
                  <Button
                    variant="text"
                    onClick={(e) => {
                      setDatePickerState(false);
                      e.stopPropagation();
                    }}
                  >
                    Підтвердити
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GuestsCounter />
        {bookingRange.to !== null && guests.adult + guests.children <= 3 && (
          <>
            <div className="disclaimer">Поки що ви ні за що не платите</div>
            <NavLink
              className="checkout-btn"
              to={`/checkout/${id}/?checkin=${moment(bookingRange.from).format(
                "YYYY-MM-DD"
              )}&checkout=${moment(bookingRange.to).format(
                "YYYY-MM-DD"
              )}&guests=${
                guests.adult + guests.children
              }&nightsCount=${nightsCount}&totalPrice=${totalPrice}`}
            >
              Забронювати
            </NavLink>
            <div className="pricing-list">
              <div className="pricing-list-item">
                <div className="subtotal">
                  {`UAH ${roomPrice} x ${nightsCount} ${pickerTitle}`}
                </div>
                <div className="total">{`UAH ${roomPrice * nightsCount}`}</div>
              </div>
              {guests.adult + guests.children >= 3 && id !== "standard" && (
                <div className="pricing-list-item">
                  <div className="subtotal">
                    {`Додаткове місце x ${nightsCount} ${pickerTitle}`}
                  </div>
                  <div className="total">{`UAH ${350 * nightsCount}`}</div>
                </div>
              )}
              <div className="pricing-list-item total-item">
                <div className="subtotal">Загалом</div>
                <div className="total">{`UAH ${totalPrice}`}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookingRange: calendarSelectors.getBookingRange(state),
  nightsCount: calendarSelectors.getNightsCount(state),
  guests: calendarSelectors.getGuests(state),
  totalPrice: calendarSelectors.getTotalPrice(state),
  reservations: calendarSelectors.getReservations(state),
  datePickerState: calendarSelectors.getDatePickerState(state),
});
const mapDispatchToProps = (dispatch) => ({
  setNightsCount: (number) =>
    dispatch(calendarOperations.setNightsCount(number)),
  setTotalPrice: (number) => dispatch(calendarOperations.setTotalPrice(number)),
  setDatePickerState: (data) =>
    dispatch(calendarOperations.setDatePickerState(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Subtotal);
