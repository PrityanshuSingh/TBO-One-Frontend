// src/components/Itinerary/Itinerary.jsx

import React from "react";
import PropTypes from "prop-types";

import ItineraryItem from "./ItineraryItem";

import styles from "./styles/Itinerary.module.scss";

const Itinerary = ({
  isEditMode,
  itinerary,
  onItineraryChange,
}) => {
  return (
    <div className={`${styles.subSection} ${styles.itinerary}`}>
      <h3>Itinerary</h3>
      {isEditMode ? (
        <>
          {itinerary?.map((dayItem, index) => (
            <ItineraryItem
              key={index}
              index={index}
              dayItem={dayItem}
              onItineraryChange={onItineraryChange}
            />
          ))}
        </>
      ) : (
        itinerary?.map((dayItem, index) => (
          <div key={index} className={styles.fieldGroup}>
            <h4>
              Day {dayItem.day} -{" "}
              {dayItem.date
                ? new Date(dayItem.date).toLocaleDateString()
                : "N/A"}
            </h4>
            <ul>
              {dayItem.activities?.map((activity, actIndex) => (
                <li key={actIndex}>{activity}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

Itinerary.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  itinerary: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number,
      date: PropTypes.string,
      activities: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onItineraryChange: PropTypes.func,
};

Itinerary.defaultProps = {
  onItineraryChange: () => {},
};

export default Itinerary;
