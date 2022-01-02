import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import roomsData from "../../../../utils/roomsData";
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
} from "swiper";
import "./RoomItem.scss";

SwiperCore.use([Navigation, Pagination, Mousewheel, Keyboard]);

const RoomItem = ({ availableRooms, roomType }) => {
  const [filteredRooms, setFilteredRooms] = useState(null);
  const [roomImages, setRoomImages] = useState(null);

  // useEffect(() => {
  //   if (roomType !== null) {
  //     switch (roomType) {
  //       case "standard":
  //         setRoomImages(roomsData.STANDARD.photos);
  //         break;
  //       case "luxe":
  //         setRoomImages(roomsData.LUXE.photos);
  //         break;
  //       case "deluxe":
  //         setRoomImages(roomsData.DELUXE.photos);
  //         break;
  //       default:
  //         setRoomImages(roomsData.STANDARD.photos);
  //     }
  //   }
  // }, [roomType]);

  useEffect(() => {
    setFilteredRooms(availableRooms);
  }, [availableRooms]);

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
          <div className="inner">
            <b>{roomsData[roomType].price} грн</b> / ніч
          </div>
        </div>
      </div>
      <NavLink to={`/room/${roomType}`} className="see-more"></NavLink>
    </div>
  );
};

export default RoomItem;
