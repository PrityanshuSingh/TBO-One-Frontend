// src/components/BasicDetails/BasicDetails.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/BasicDetails.module.scss";

const BasicDetails = ({
  isEditMode,
  basicDetails,
  onChange,
}) => {
  return (
    <div className={styles.basicDetails}>
      <h3>Basic Details</h3>
      <div className={styles.field}>
        <label htmlFor="packageTitle">Package Title:</label>
        {isEditMode ? (
          <input
            type="text"
            id="packageTitle"
            name="packageTitle"
            value={basicDetails.packageTitle || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.packageTitle || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="location">Location:</label>
        {isEditMode ? (
          <input
            type="text"
            id="location"
            name="location"
            value={basicDetails.location || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.location || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="duration">Duration:</label>
        {isEditMode ? (
          <input
            type="text"
            id="duration"
            name="duration"
            value={basicDetails.duration || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.duration || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="bestTimeToVisit">Best Time to Visit:</label>
        {isEditMode ? (
          <input
            type="text"
            id="bestTimeToVisit"
            name="bestTimeToVisit"
            value={basicDetails.bestTimeToVisit || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.bestTimeToVisit || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="shortDescription">Short Description:</label>
        {isEditMode ? (
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={basicDetails.shortDescription || ""}
            onChange={onChange}
            className={styles.textarea}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.shortDescription || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="detailedDescription">Detailed Description:</label>
        {isEditMode ? (
          <textarea
            id="detailedDescription"
            name="detailedDescription"
            value={basicDetails.detailedDescription || ""}
            onChange={onChange}
            className={styles.textarea}
            aria-required="true"
          />
        ) : (
          <span>{basicDetails.detailedDescription || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="notes">Notes:</label>
        {isEditMode ? (
          <textarea
            id="notes"
            name="notes"
            value={basicDetails.notes || ""}
            onChange={onChange}
            className={styles.textarea}
          />
        ) : (
          <span>{basicDetails.notes || "N/A"}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="recommendationTags">Recommendation Tags:</label>
        {isEditMode ? (
          <input
            type="text"
            id="recommendationTags"
            name="recommendationTags"
            value={basicDetails.recommendationTags?.join(", ") || ""}
            onChange={(e) => onChange(e, "recommendationTags")}
            className={styles.input}
            placeholder="Enter tags separated by commas"
            aria-required="false"
          />
        ) : (
          <span>{basicDetails.recommendationTags?.join(", ") || "N/A"}</span>
        )}
      </div>
    </div>
  );
};

BasicDetails.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  basicDetails: PropTypes.shape({
    packageTitle: PropTypes.string,
    location: PropTypes.string,
    duration: PropTypes.string,
    bestTimeToVisit: PropTypes.string,
    shortDescription: PropTypes.string,
    detailedDescription: PropTypes.string,
    notes: PropTypes.string,
    recommendationTags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BasicDetails;
