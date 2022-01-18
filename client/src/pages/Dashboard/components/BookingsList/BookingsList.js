import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import authSelectors from "../../../../redux/auth/authSelectors";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import './BookingsList.scss'

const BookingsList = ({ reservations, isAuthenticated }) => {
  const [filteredReservations, setFilteredReservations] = useState(null);

  useEffect(() => {
      if(isAuthenticated) {
        const filtered = reservations.filter((item) => {
            return new Date(item.start) >= new Date(new Date().setHours(0,0,0,0));
          });
          filtered.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
          });
          setFilteredReservations(filtered);
      }
  }, [reservations, isAuthenticated]);

  return (
    <>
      {filteredReservations !== null && filteredReservations.length > 0 && (
        <div className="bookings-list">
          <div className="booking-cards-title">
            <h3>Последние бронирования</h3>
          </div>
          <div className="booking-cards">
            {filteredReservations.map((item, idx) => {
              return (
                <div className="booking-card" key={idx}>
                  <div className="card-left">
                    <div className="name">{item.name}</div>
                    <div className="nigts-guests">{`${item.nightsCount} ночей - ${item.guests} гостей`}</div>
                    <div className="room-type">{item.roomType}</div>
                  </div>
                  <div className="card-center">
                    <div className="booking-dates">
                      {`${moment(item.start).format("DD.MM.YY")} - ${moment(
                        item.end
                      ).format("DD.MM.YY")}`}
                    </div>
                  </div>
                  <div className="card-right">
                    <div className="total">UAH {item.totalPrice}</div>
                    <div className="book-date">{moment(item.bookingDate).format("DD.MM.YY")}</div> 
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  reservations: calendarSelectors.getReservations(state),
  isAuthenticated: authSelectors.getIsAuthenticated(state)
});
export default connect(mapStateToProps, null)(BookingsList);
