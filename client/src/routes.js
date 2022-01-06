import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import CalendarPage from "./pages/calendar/CalendarPage"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AllRooms from "./pages/booking/AllRooms";
import Room from "./pages/booking/components/RoomDetails/RoomDetails";
import Checkout from "./pages/booking/components/Checkout";

const UseRoutes = ({isAuthenticated}) => {

  if (isAuthenticated) {
    return (
    <React.Fragment>
    <Routes>
        <Route path="/calendar" exact element={<Dashboard/>}/>
        <Route path="/calendar/:id" exact element={<CalendarPage/>}/>
        <Route path="/login" element={<Navigate replace to="/calendar" />} />
        <Route path="/register" element={<Navigate replace to="/calendar" />} />
        <Route path="/booking/:id" element={<Navigate replace to="/calendar/:id" />} />
        <Route path="/" element={<Navigate replace to="/calendar" />} />
    </Routes>
    </React.Fragment>
    );
  }
  return (
    <React.Fragment>
  <Routes>
    <Route path="/" element={<AllRooms/>}/>
    <Route path="/room/:id" element={<Room/>}/>
    <Route path="/checkout" element={<Checkout/>}/>
    <Route path="/login" exact element={<Login/>}/>
    <Route path="/register" exact element={<Register/>}/>
    <Route path="/calendar/*" element={<Navigate replace to="/" />} />
</Routes>
</React.Fragment>
);
};

export default UseRoutes