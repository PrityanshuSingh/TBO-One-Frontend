// src/components/Itinerary/ItineraryItem.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/ItineraryItem.module.scss";

const ItineraryItem = ({ index, dayItem, onItineraryChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onItineraryChange(index, name, value);
  };

  return (
    <div className={styles.fieldGroup}>
      <h4>Day {dayItem.day}</h4>
      <div className={styles.field}>
        <label htmlFor={`itineraryDate-${index}`}>Date:</label>
        <input
          type="date"
          id={`itineraryDate-${index}`}
          name="date"
          value={dayItem.date ? dayItem.date.split("T")[0] : ""}
          onChange={handleChange}
          className={styles.input}
          aria-required="false"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`itineraryActivities-${index}`}>Activities:</label>
        <textarea
          id={`itineraryActivities-${index}`}
          name="activities"
          value={dayItem.activities?.join(", ") || ""}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Enter activities separated by commas"
          aria-required="false"
        />
      </div>
    </div>
  );
};

ItineraryItem.propTypes = {
  index: PropTypes.number.isRequired,
  dayItem: PropTypes.shape({
    day: PropTypes.number,
    date: PropTypes.string,
    activities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onItineraryChange: PropTypes.func.isRequired,
};

export default ItineraryItem;
