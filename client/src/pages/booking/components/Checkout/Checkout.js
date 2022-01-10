import React, { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import "./Checkout.scss";
import { NavLink, useSearchParams } from "react-router-dom";
import { useParams } from "react-router";
import BookingDetails from "./BookingDetails/BookingDetails";
import PaymentDetails from "./PaymentDetails/PaymentDetails";
import BookingForm from "./BookingForm/BookingForm";
import { createSearchParams } from "react-router-dom";
import SuccessBlock from "./SuccessBlock/SuccessBlock";

const Checkout = () => {
  const { id } = useParams();
  const [formVisible, setFormVisible] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") !== null) {
      setFormVisible(false);
    }
  }, [searchParams]);

  return (
    <div className="checkout-container">
      {formVisible &&
            <div className="back-to-header">
            <NavLink to={`/room/${id}`}>
              <Icon>keyboard_arrow_left</Icon>
              Назад
            </NavLink>
          </div>
      }
      <div className="checkout-columns-container">
        <div className="checkout-col">
          {formVisible ? (
            <>
              <BookingDetails />
              <PaymentDetails />
              <BookingForm />
            </>
          ) : (
            <SuccessBlock />
          )}
        </div>
      </div>
    </div>
  );
};
export default Checkout;
