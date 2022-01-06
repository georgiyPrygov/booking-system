import { useEffect, useState } from "react";
import { connect } from "react-redux";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import RoomItem from "./RoomItem/RoomItem";
import "./RoomsList.scss";

const RoomsList = ({ availableRooms, bookingRange }) => {
  const [filteredRooms, setFilteredRooms] = useState(null);

  useEffect(() => {
    setFilteredRooms(availableRooms);
  }, [availableRooms]);

  const roomsArray = [];
  for (const property in filteredRooms) {
    roomsArray.push({ property, value: filteredRooms[property]});
  }

  return (
    <>
      {availableRooms !== null && bookingRange.to !== null && (
        <div className="available-rooms-list">
          {roomsArray.length !== 0 && roomsArray.map((item, idx) => {
            return <div className="room-item-block" key={idx}>
             {item.value > 0 && <RoomItem roomType={item.property} amountAvailable={item.value}/>}
            </div>;
          })}
        </div>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  bookingRange: calendarSelectors.getBookingRange(state),
  availableRooms: calendarSelectors.getAvailableRooms(state),
});
export default connect(mapStateToProps, null)(RoomsList);
