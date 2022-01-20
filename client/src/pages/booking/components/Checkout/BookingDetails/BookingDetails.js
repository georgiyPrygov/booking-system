import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import roomsData from "../../../../../utils/roomsData";
import { useNavigate, useParams } from "react-router";
import calendarSelectors from "../../../../../redux/calendar/calendarSelectors";
import authSelectors from "../../../../../redux/auth/authSelectors";
import calendarOperations from "../../../../../redux/calendar/calendarOperations";
import moment from 'moment';
import { useSearchParams } from "react-router-dom";

const BookingDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


  const paramsDates = {
    from: new Date(searchParams.get("checkin")),
    to: new Date(searchParams.get("checkout")),
  };
  
    useEffect(() => {
      if (
        searchParams.get("checkin") === null ||
        searchParams.get("checkout") === null ||
        searchParams.get("guests") === null
      ) {
        navigate(`/room/${id}`);
      }
    }, [searchParams]);

  return (
      <div className="section">
          <div className="section-title">Деталі бронювання</div>
          <div className="section-content">
              <div className="booking-details-top">
                  <div className="room-image">
                      <img src={roomsData[id].slider_photos[0]}  width='150'/>
                  </div>
                  <div className="top-content">
                  <div className="category">{roomsData[id].category}</div>
                  <div className="name">{roomsData[id].name}</div>
                  </div>
              </div>
              <div className="section-content__item">
                <div className="item-subtitle">Дати</div>
                <div className="item-value">{`${moment(paramsDates.from).format(
                  "DD.MM.YY"
                )} - ${moment(paramsDates.to).format("DD.MM.YY")}`}</div>
              </div>
              <div className="section-content__item">
                <div className="item-subtitle">Гості</div>
                <div className="item-value">{searchParams.get("guests")}</div>
              </div>
              <div className="section-content__item">
                <div className="item-subtitle">Сумма бронювання</div>
                <div className="item-value">{`UAH ${searchParams.get("totalPrice")}`}</div>
              </div>
            </div>
      </div>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  range: calendarSelectors.getRange(state),
  userId: authSelectors.getUserId(state),
});
const mapDispatchToProps = (dispatch) => ({
  addReservation: (reservation) =>
    dispatch(calendarOperations.addReservation(reservation)),
});
export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);
