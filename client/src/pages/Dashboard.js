import React from "react";
import {
  Container,
  Box,
} from "@mui/material";
import RoomSelect from "../components/RoomSelect/RoomSelect";


const Dashboard = () => {
  return (
    <Container>
      <Box>
        <h1>Выберите тип комнаты</h1>
      </Box>
      <RoomSelect/>
    </Container>
  );
};
export default Dashboard;
