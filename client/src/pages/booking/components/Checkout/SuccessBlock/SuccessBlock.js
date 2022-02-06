import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import './SuccessBlock.scss';

const SuccessBlock = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dayPrice, setDayPrice] = useState(0);

  useEffect(() => {
    setDayPrice(
      parseInt(searchParams.get("totalPrice")) /
        parseInt(searchParams.get("nightsCount"))
    );
  }, [dayPrice]);


  return (
    <div className="success-container">
        <div className="success-inner-content">
            <div className="success-image">
                <Icon>check_circle</Icon>
            </div>
            <div className="success-text">
                <div className="title">Дякуємо що забронювали номер в нашому шале</div>
                <div className="descr">Ваше бронювання успішно підтверджене. Деталі ви зможете знайти в емейл повідомленні. Чекаємо на вас в гості :)</div>
            </div> 
            <div className="descr">В разі додаткових питань, нам можна написати на <a href="mailto:agorahotel.in.ua@gmail.com">agorahotel.in.ua@gmail.com</a> або зателефонувати за номером <a href="tel:+380971914806" class="phone-link">+38 (097) 191 48 06</a> </div>

            <div className="next-booking"><NavLink to="/">Забронювати ще один номер</NavLink></div>
        </div>
    </div>
  );
};
export default SuccessBlock;
