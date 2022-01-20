import React, {useState} from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import './RoomSelect.scss';
import roomsData from "../../utils/roomsData";


const RoomSelect = () => {
    const navigate = useNavigate();
    const { id } = useParams();
  const [roomType, setRoomType] = useState(`/calendar/${id}`);

  const handleChange = (e) => {
    setRoomType(e.target.value);
    navigate(e.target.value);
  };

  return (
      <FormControl fullWidth className="room-select-container">
        <InputLabel id="room-select-label">Тип комнаты</InputLabel>
        <Select
          labelId="room-select-label"
          id="room-type-select"
          value={id !== undefined ? roomType : ''}
          label="Тип комнаты"
          onChange={handleChange}
        >
          {Object.keys(roomsData).map((item) => {
            return <MenuItem key={roomsData[item].id} value={`/calendar/${roomsData[item].adminName}`}>{roomsData[item].adminCategory}</MenuItem>
          })}
        </Select>
      </FormControl>
  );
};
export default RoomSelect;
