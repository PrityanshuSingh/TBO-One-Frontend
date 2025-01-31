// src/components/AdditionalServices/AdditionalServices.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/AdditionalServices.module.scss";

const AdditionalServices = ({
  isEditMode,
  additionalServices,
  onChange,
}) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const booleanValue = value === "true";
    onChange(name, booleanValue);
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className={`${styles.subSection} ${styles.additionalServices}`}>
      <h3>Additional Services</h3>
      {isEditMode ? (
        <>
          <div className={styles.field}>
            <label htmlFor="travelInsurance">Travel Insurance:</label>
            <select
              id="travelInsurance"
              name="travelInsurance"
              value={additionalServices.travelInsurance ? "true" : "false"}
              onChange={handleSelectChange}
              className={styles.input}
              aria-required="false"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="visaAssistance">Visa Assistance:</label>
            <select
              id="visaAssistance"
              name="visaAssistance"
              value={additionalServices.visaAssistance ? "true" : "false"}
              onChange={handleSelectChange}
              className={styles.input}
              aria-required="false"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="specialRequests">Special Requests:</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={additionalServices.specialRequests || ""}
              onChange={handleTextareaChange}
              className={styles.textarea}
              aria-required="false"
            />
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Travel Insurance:</strong>{" "}
            {additionalServices.travelInsurance ? "Yes" : "No"}
          </p>
          <p>
            <strong>Visa Assistance:</strong>{" "}
            {additionalServices.visaAssistance ? "Yes" : "No"}
          </p>
          <p>
            <strong>Special Requests:</strong>{" "}
            {additionalServices.specialRequests || "N/A"}
          </p>
        </>
      )}
    </div>
  );
};

AdditionalServices.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  additionalServices: PropTypes.shape({
    travelInsurance: PropTypes.bool,
    visaAssistance: PropTypes.bool,
    specialRequests: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AdditionalServices;
