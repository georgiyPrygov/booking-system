import { useEffect, useState } from "react";
import RoomItem from "../RoomItem/RoomItem";
import "./RoomsList.scss";

const RoomsList = ({ availableRooms, rangeState }) => {
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
      {availableRooms !== null && rangeState.to !== null && (
        <div className="available-rooms-list">
          {roomsArray.length !== 0 && roomsArray.map((item, idx) => {
            return <div className="room-item-block" key={idx}>
             {item.value > 0 && <RoomItem roomType={item.property} rangeState={rangeState}/>}
            </div>;
          })}
        </div>
      )}
    </>
  );
};

export default RoomsList;
