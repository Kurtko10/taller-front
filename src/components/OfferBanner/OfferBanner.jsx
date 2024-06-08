import React from "react";
import { Carousel } from "react-bootstrap";
import "./OfferBanner.css"; 
const OfferBanner = () => {
  const offers = [
    { id: 1, src: "../../img/neumaticos1.jpg", alt: "Oferta 1" },
    { id: 2, src: "../../img/aceite.jpg", alt: "Oferta 2" },
    { id: 3, src: "../../img/Oferta-en-MO.png", alt: "Oferta 3" },
  ];

  return (
    <div className="offer-banner-container">
      <Carousel indicators={false} interval={3000}>
        {offers.map((offer) => (
          <Carousel.Item key={offer.id}>
            <img
              className="d-block w-100"
              src={offer.src}
              alt={offer.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default OfferBanner;
