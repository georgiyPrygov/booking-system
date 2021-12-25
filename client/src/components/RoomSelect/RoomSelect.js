import React, {useState} from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import './RoomSelect.scss'


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
          value={roomType}
          label="Тип комнаты"
          onChange={handleChange}
        >
          <MenuItem value={"/calendar/standard"}>Стандарт</MenuItem>
          <MenuItem value={"/calendar/luxe"}>Люкс</MenuItem>
          <MenuItem value={"/calendar/deluxe"}>Делюкс</MenuItem>
        </Select>
      </FormControl>
  );
};
export default RoomSelect;
