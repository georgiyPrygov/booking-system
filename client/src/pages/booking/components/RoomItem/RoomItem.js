import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import roomsData from "../../../../utils/roomsData";

const RoomItem = ({ availableRooms, rangeState, roomType}) => {
  const [filteredRooms, setFilteredRooms] = useState(null);

  useEffect(() => {
    setFilteredRooms(availableRooms);
  }, [availableRooms]);

  return (
    <div className="room-list-item">
        {roomType}
      <div className="slider">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper>
      </div>
      {roomType === 'standard' && roomsData.STANDARD.price}
      {roomType === 'luxe' && roomsData.LUXE.price}
      {roomType === 'deluxe' && roomsData.DELUXE.price}
      <NavLink to={`/room/${roomType}`} >Details</NavLink>
    </div>
  );
};

export default RoomItem;
