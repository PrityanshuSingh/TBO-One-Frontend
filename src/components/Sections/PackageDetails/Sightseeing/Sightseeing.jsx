// src/components/Sightseeing/Sightseeing.jsx

import React from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";  // Import html-react-parser

import SightseeingItem from "./SightseeingItem";

import styles from "./styles/Sightseeing.module.scss";

const Sightseeing = ({
  isEditMode,
  sightseeing,
  onSightseeingChange,
}) => {
  return (
    <div className={`${styles.subSection} ${styles.sightseeing}`}>
      <h3>Sightseeing</h3>
      {isEditMode ? (
        <div className={styles.fieldGroup}>
          {sightseeing?.map((sight, index) => (
            <SightseeingItem
              key={index}
              index={index}
              sight={sight}
              onSightseeingChange={onSightseeingChange}
            />
          ))}
        </div>
      ) : (
        sightseeing?.map((sight, index) => (
          <div key={index} className={styles.sightseeingItem}>
            <h4>Sightseeing {index + 1}</h4>
            <img
              src={
                sight.ImageList && sight.ImageList.length > 0
                  ? sight.ImageList[0]
                  : defaultImage
              }
              alt={sight.SightseeingName || `Sightseeing ${index + 1}`}
              className={styles.sightseeingImage}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null; // Prevents infinite loop if default image fails
                e.target.src = defaultImage;
              }}
            />
            <p>
              <strong>Name:</strong> {sight.SightseeingName || "N/A"}
            </p>
            <p>
              <strong>Types:</strong> {sight.SightseeingTypes?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> 
              {/* Render the HTML description */}
              <span>{parse(sight.TourDescription || "N/A")}</span>
            </p>
            {/* Add more details as necessary */}
          </div>
        ))
      )}
    </div>
  );
};

Sightseeing.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  sightseeing: PropTypes.arrayOf(
    PropTypes.shape({
      SightseeingName: PropTypes.string,
      SightseeingTypes: PropTypes.arrayOf(PropTypes.string),
      TourDescription: PropTypes.string,
      ImageList: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onSightseeingChange: PropTypes.func,
};

Sightseeing.defaultProps = {
  onSightseeingChange: () => {},
};

export default Sightseeing;
