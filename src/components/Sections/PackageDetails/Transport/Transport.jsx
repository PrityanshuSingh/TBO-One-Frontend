// src/components/Transport/Transport.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/Transport.module.scss";

const Transport = ({
  isEditMode,
  transportDetails,
  onTransportChange,
}) => {
  const handlePickupChange = (e) => {
    const { name, value } = e.target;
    onTransportChange("pickup", name, value);
  };

  const handleDropoffChange = (e) => {
    const { name, value } = e.target;
    onTransportChange("dropoff", name, value);
  };

  return (
    <div className={`${styles.subSection} ${styles.transport}`}>
      <h3>Transport</h3>
      {isEditMode ? (
        <>
          {/* Pickup Details */}
          <h4>Pickup</h4>
          <div className={styles.field}>
            <label htmlFor="pickupType">Type:</label>
            <input
              type="text"
              id="pickupType"
              name="type"
              value={transportDetails.airportTransfers.pickup.type || ""}
              onChange={handlePickupChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="pickupDatetime">Datetime:</label>
            <input
              type="datetime-local"
              id="pickupDatetime"
              name="datetime"
              value={
                transportDetails.airportTransfers.pickup.datetime
                  ? transportDetails.airportTransfers.pickup.datetime.split(".")[0]
                  : ""
              }
              onChange={handlePickupChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="pickupLocation">Pickup Location:</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={transportDetails.airportTransfers.pickup.pickupLocation || ""}
              onChange={handlePickupChange}
              className={styles.input}
              aria-required="false"
            />
          </div>

          {/* Dropoff Details */}
          <h4>Dropoff</h4>
          <div className={styles.field}>
            <label htmlFor="dropoffType">Type:</label>
            <input
              type="text"
              id="dropoffType"
              name="type"
              value={transportDetails.airportTransfers.dropoff.type || ""}
              onChange={handleDropoffChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="dropoffDatetime">Datetime:</label>
            <input
              type="datetime-local"
              id="dropoffDatetime"
              name="datetime"
              value={
                transportDetails.airportTransfers.dropoff.datetime
                  ? transportDetails.airportTransfers.dropoff.datetime.split(".")[0]
                  : ""
              }
              onChange={handleDropoffChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="dropoffLocation">Dropoff Location:</label>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={transportDetails.airportTransfers.dropoff.dropoffLocation || ""}
              onChange={handleDropoffChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Pickup:</strong>{" "}
            {transportDetails.airportTransfers.pickup.type || "N/A"} at{" "}
            {transportDetails.airportTransfers.pickup.datetime
              ? new Date(
                  transportDetails.airportTransfers.pickup.datetime
                ).toLocaleString()
              : "N/A"}{" "}
            from {transportDetails.airportTransfers.pickup.pickupLocation || "N/A"}
          </p>
          <p>
            <strong>Dropoff:</strong>{" "}
            {transportDetails.airportTransfers.dropoff.type || "N/A"} at{" "}
            {transportDetails.airportTransfers.dropoff.datetime
              ? new Date(
                  transportDetails.airportTransfers.dropoff.datetime
                ).toLocaleString()
              : "N/A"}{" "}
            to {transportDetails.airportTransfers.dropoff.dropoffLocation || "N/A"}
          </p>
        </>
      )}
    </div>
  );
};

Transport.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  transportDetails: PropTypes.shape({
    airportTransfers: PropTypes.shape({
      pickup: PropTypes.shape({
        type: PropTypes.string,
        datetime: PropTypes.string,
        pickupLocation: PropTypes.string,
      }),
      dropoff: PropTypes.shape({
        type: PropTypes.string,
        datetime: PropTypes.string,
        dropoffLocation: PropTypes.string,
      }),
    }),
  }).isRequired,
  onTransportChange: PropTypes.func.isRequired,
};

export default Transport;
