import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import './SuccessBlock.scss';
import facebook from '../../../../../assets/img/icons/facebook.svg';
import instagram from '../../../../../assets/img/icons/instagram.svg';
import viber from '../../../../../assets/img/icons/viber.svg';

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
                <div className="descr">Для підтвердження бронювання , потрібно оплатити передплату за 1 ніч проживання <span className="prep-sum">{`UAH ${dayPrice}`}</span> за реквізитами :</div>
                <div className="reqs">
                    <div className="item">Приватбанк 4149 6293 8451 1093 , Пригова Вікторія</div>
                </div>
                <div className="descr">Вислати скріншот оплати або фото чеку зручним для вас способом</div>
            </div>
            <div className="socials-block">
                <a target="_blank" href="https://msng.link/o/?agora_chalet=ig">
                    <img src={instagram} width="70"/>
                </a>
                <a target="_blank" href="https://msng.link/o/?380509441474=vi">
                    <img src={viber} width="75"/>
                </a>
                <a target="_blank" href="https://msng.link/o/?agorachalet=fm">
                    <img src={facebook} width="70"/>
                </a>
            </div>
            <div className="descr">Нам також можна написати на <a href="mailto:agorahotel.in.ua@gmail.com">agorahotel.in.ua@gmail.com</a> або зателефонувати за номером <a href="tel:+380971914806" class="phone-link">+38 (097) 191 48 06</a> </div>
        </div>
    </div>
  );
};
export default SuccessBlock;
