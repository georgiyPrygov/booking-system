import { Button, Icon } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router";
import roomsData from "../../../../../utils/roomsData";
import "./DetailsGallery.scss";

const DetailsGallery = () => {
  const { id } = useParams();
  const [galleryState, setGalleryState] = useState(false);

  const handleGalleryState = (e) => {
    setGalleryState(e);
  };

  return (
    <>
      <div
        className="gallery-container"
        onClick={() => handleGalleryState(true)}
      >
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
        <div className="mobile-images-counter">
            {`1 / ${roomsData[id].slider_photos.length}`}
        </div>
      </div>
      <div
        className={
          galleryState
            ? "overflow-gallery-modal opened"
            : "overflow-gallery-modal"
        }
      >
        <div className="header-actions">
          <Button
            className="close-btn"
            variant="text"
            onClick={() => handleGalleryState(false)}
            startIcon={<Icon>close</Icon>}
          >
            Закрити
          </Button>
        </div>
        <div className="overflow-gallery-content">
          {roomsData[id].slider_photos.map((item, idx) => {
              return (
                <div className="gallery-image" key={idx}>
                  <img src={item} width="200" />
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailsGallery;
