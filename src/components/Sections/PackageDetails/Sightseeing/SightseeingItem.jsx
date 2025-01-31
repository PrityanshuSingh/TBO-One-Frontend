// src/components/Sightseeing/SightseeingItem.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/SightseeingItem.module.scss";

const SightseeingItem = ({ index, sight, onSightseeingChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSightseeingChange(index, name, value);
  };

  // Handle changes to ImageList as a comma-separated string
  const handleImagesChange = (e) => {
    const { value } = e.target;
    const imagesArray = value.split(",").map((img) => img.trim());
    onSightseeingChange(index, "ImageList", imagesArray);
  };

  return (
    <div className={styles.sightseeingItem}>
      <h4>Sightseeing {index + 1}</h4>
      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label htmlFor={`SightseeingName-${index}`}>Name:</label>
          <input
            type="text"
            id={`SightseeingName-${index}`}
            name="SightseeingName"
            value={sight.SightseeingName || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter Sightseeing Name"
            aria-required="true"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`SightseeingTypes-${index}`}>Types:</label>
          <input
            type="text"
            id={`SightseeingTypes-${index}`}
            name="SightseeingTypes"
            value={sight.SightseeingTypes?.join(", ") || ""}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter types separated by commas"
            aria-required="false"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`TourDescription-${index}`}>Description:</label>
          <textarea
            id={`TourDescription-${index}`}
            name="TourDescription"
            value={sight.TourDescription || ""}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Enter Tour Description"
            aria-required="false"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`ImageList-${index}`}>Image URLs:</label>
          <input
            type="text"
            id={`ImageList-${index}`}
            name="ImageList"
            value={sight.ImageList?.join(", ") || ""}
            onChange={handleImagesChange}
            className={styles.input}
            placeholder="Enter image URLs separated by commas"
            aria-required="false"
          />
        </div>
        {/* Add more editable fields as necessary */}
      </div>
    </div>
  );
};

SightseeingItem.propTypes = {
  index: PropTypes.number.isRequired,
  sight: PropTypes.shape({
    SightseeingName: PropTypes.string,
    SightseeingTypes: PropTypes.arrayOf(PropTypes.string),
    TourDescription: PropTypes.string,
    ImageList: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSightseeingChange: PropTypes.func.isRequired,
};

export default SightseeingItem;
