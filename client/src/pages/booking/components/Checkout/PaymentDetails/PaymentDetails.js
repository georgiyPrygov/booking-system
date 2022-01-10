import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../../../redux/calendar/calendarSelectors";
import { useSearchParams } from "react-router-dom";

const BookingDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dayPrice, setDayPrice] = useState(0);
  const [restOfPrice, setRestOfPrice] = useState(0);

  useEffect(() => {
    setDayPrice(
      parseInt(searchParams.get("totalPrice")) /
        parseInt(searchParams.get("nightsCount"))
    );
    setRestOfPrice(
      parseInt(searchParams.get("totalPrice")) -
        parseInt(searchParams.get("totalPrice")) /
          parseInt(searchParams.get("nightsCount"))
    );
  }, [dayPrice]);

  return (
    <div className="section">
      <div className="section-title">Деталі оплати</div>
      <div className="section-content">
        <div className="section-content__item">
          <div className="item-subtitle">Передплата</div>
          <div className="item-value">
            Після підтвердження бронювання, вам потрібно оплатити передплату за
            1 ніч проживання {`UAH ${dayPrice}`} протягом двох днів від дати
            підтвердження.
          </div>
        </div>
        {restOfPrice !== 0 && (
          <div className="section-content__item">
            <div className="item-subtitle">Залишок оплати</div>
            <div className="item-value">
              Після передплати, залишок {`UAH ${restOfPrice} `}
              можна буде оплатити в готелі, готівкою або переказом на картку.
            </div>
          </div>
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
});
export default connect(mapStateToProps, null)(BookingDetails);
