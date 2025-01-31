// src/components/ImageSection/ImageSection.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/ImageSection.module.scss";

const ImageSection = ({ image, isEditMode, onImageChange }) => {
  return (
    <div className={styles.imageSection}>
      <img
        src={image}
        alt="Package"
        className={styles.packageImage}
        loading="lazy"
      />
      {isEditMode && (
        <div className={styles.imageUpload}>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={onImageChange}
            aria-label="Upload Package Image"
          />
          <label htmlFor="imageUpload">Change Image</label>
        </div>
      )}
    </div>
  );
};

ImageSection.propTypes = {
  image: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  onImageChange: PropTypes.func.isRequired,
};

export default ImageSection;
