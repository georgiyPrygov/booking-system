import React from "react";
import { useParams } from "react-router";
import roomsData from "../../../../../utils/roomsData";

const DetailsGallery = () => {
  const { id } = useParams();

  return (
    <div className="gallery-container">
      <div className="main-block">
        {roomsData[id].slider_photos.map((item, idx) => {
          {
            if (idx === 0) {
              return (
                <div className="gallery-image" key={idx}>
                  <img src={item} width="200" />
                </div>
              );
            }
          }
        })}
      </div>
      <div className="secondary-images-block">
        {roomsData[id].slider_photos.map((item, idx) => {
          {
            if (idx !== 0 && idx <= 4) {
              return (
                <div className="gallery-image" key={idx}>
                  <img src={item} width="200" />
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};

export default DetailsGallery;
