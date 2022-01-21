import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import roomsData from "../../../../../utils/roomsData";
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
} from "swiper";
import "./RoomItem.scss";
import { connect } from "react-redux";
import calendarSelectors from "../../../../../redux/calendar/calendarSelectors";

SwiperCore.use([Navigation, Pagination, Mousewheel, Keyboard]);

const RoomItem = ({ roomType, amountAvailable, guests }) => {


  return (
    <div className="room-list-item">
      <div className="slider">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
        >
          {roomType !== null &&
            roomsData[roomType].slider_photos.map((item, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <img src={item} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
      <div className="room-item-content">
        <div className="category">{roomsData[roomType].category}</div>
        <div className="name">{roomsData[roomType].name}</div>
        <div className="details">{roomsData[roomType].details}</div>
        <div className="price-block">
          <div className="available-rooms">
            {`( Доступно ${amountAvailable} )`}
          </div>
          <div className="inner">
            <b>{ (guests.adult + guests.children) > 2 ? roomsData[roomType].price + roomsData[roomType].extra_cost : roomsData[roomType].price
            } грн</b> / ніч
          </div>
        </div>
      </div>
      <NavLink to={`/room/${roomType}`} className="see-more"></NavLink>
    </div>
  );
};

const mapStateToProps = (state) => ({
  guests: calendarSelectors.getGuests(state),
});

export default connect(mapStateToProps,null)(RoomItem);
