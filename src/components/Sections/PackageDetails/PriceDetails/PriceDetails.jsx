// src/components/PriceDetails/PriceDetails.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/PriceDetails.module.scss";

const PriceDetails = ({
  isEditMode,
  priceDetails,
  onChange,
}) => {
  return (
    <div className={styles.priceDetails}>
      <h3>Price Details</h3>
      <div className={styles.field}>
        <label htmlFor="price.currency">Currency:</label>
        {isEditMode ? (
          <input
            type="text"
            id="price.currency"
            name="currency"
            value={priceDetails.currency || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{priceDetails.currency || "N/A"}</span>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="price.basePrice">Base Price:</label>
        {isEditMode ? (
          <input
            type="number"
            id="price.basePrice"
            name="basePrice"
            value={priceDetails.basePrice || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{priceDetails.basePrice || "N/A"}</span>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="price.taxes">Taxes:</label>
        {isEditMode ? (
          <input
            type="number"
            id="price.taxes"
            name="taxes"
            value={priceDetails.taxes || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{priceDetails.taxes || "N/A"}</span>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="price.discount">Discount:</label>
        {isEditMode ? (
          <input
            type="number"
            id="price.discount"
            name="discount"
            value={priceDetails.discount || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="false"
          />
        ) : (
          <span>{priceDetails.discount || "N/A"}</span>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="price.totalPrice">Total Price:</label>
        {isEditMode ? (
          <input
            type="number"
            id="price.totalPrice"
            name="totalPrice"
            value={priceDetails.totalPrice || ""}
            onChange={onChange}
            className={styles.input}
            aria-required="true"
          />
        ) : (
          <span>{priceDetails.totalPrice || "N/A"}</span>
        )}
      </div>
    </div>
  );
};

PriceDetails.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  priceDetails: PropTypes.shape({
    currency: PropTypes.string,
    basePrice: PropTypes.number,
    taxes: PropTypes.number,
    discount: PropTypes.number,
    totalPrice: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PriceDetails;
