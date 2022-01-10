import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import roomsData from "../../../../utils/roomsData";
import DatePick from "../DatePick/DatePick";
import DetailsGallery from "./DetailsGallery/DetailsGallery";
import Subtotal from "./Subtotal/Subtotal";
import "./RoomDetails.scss";
import calendarSelectors from "../../../../redux/calendar/calendarSelectors";
import { connect } from "react-redux";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { Icon } from "@mui/material";

const RoomDetails = ({ bookingRange, nightsCount }) => {
  const { id } = useParams();

  const [pickerTitle, setPickerTitle] = useState("Виберіть дати");
  const [pickerDescr, setPickerDescr] = useState(
    "Щоб побачити ціни, виберіть дати"
  );

  useEffect(() => {
    if (bookingRange.from === null) {
      setPickerTitle("Виберіть дати");
    } else if (bookingRange.from !== null && bookingRange.to !== null) {
      if (nightsCount === 1) {
        setPickerTitle(`${nightsCount} ніч в Агора Шале`);
      } else if (nightsCount > 1 && nightsCount < 5) {
        setPickerTitle(`${nightsCount} ночі в Агора Шале`);
      } else if (nightsCount >= 5) {
        setPickerTitle(`${nightsCount} ночей в Агора Шале`);
      }
    }
  }, [bookingRange, nightsCount]);

  useEffect(() => {
    if (bookingRange.from === null) {
      setPickerDescr("Щоб побачити ціни, виберіть дати");
    } else if (bookingRange.from !== null && bookingRange.to !== null) {
      setPickerDescr(
        `${moment(bookingRange.from).format("DD.MM.YY")} - ${moment(
          bookingRange.to
        ).format("DD.MM.YY")}`
      );
    }
  }, [bookingRange]);

  return (
    <div className="view-container">
      <div className="back-to-header">
        <NavLink to={`/`}>
          <Icon>keyboard_arrow_left</Icon>
          Назад
        </NavLink>
      </div>
      <div className="room-details_title">
        <div className="title">{roomsData[id].name}</div>
        <div className="descr">{roomsData[id].details}</div>
      </div>
      <DetailsGallery />
      <div className="dates-and-subtotal-container">
        <div className="main-container">
          <div className="section">
            <div className="room-details_title">
              <div className="secondary-title">{pickerTitle}</div>
              <div className="descr">{pickerDescr}</div>
            </div>
            <DatePick />
          </div>
        </div>
        <div className="subtotal-column">
          <Subtotal />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookingRange: calendarSelectors.getBookingRange(state),
  nightsCount: calendarSelectors.getNightsCount(state),
});
export default connect(mapStateToProps, null)(RoomDetails);
