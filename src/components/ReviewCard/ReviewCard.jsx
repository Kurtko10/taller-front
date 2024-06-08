import React from 'react';
import PropTypes from 'prop-types';
import './ReviewCard.css';

const ReviewCard = ({ reviewer, rating, review }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'star filled' : 'star'}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <h5 className="reviewer">{reviewer}</h5>
      <div className="stars">{renderStars()}</div>
      <p className="review-text">{review}</p>
    </div>
  );
};

ReviewCard.propTypes = {
  reviewer: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
};

export default ReviewCard;
