// src/components/Hotel/Hotel.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles/Hotel.module.scss";

const Hotel = ({
  isEditMode,
  hotelDetails,
  onChange,
  onAmenitiesChange,
}) => {
  return (
    <div className={`${styles.subSection} ${styles.hotel}`}>
      <h3>Hotel</h3>
      {isEditMode ? (
        <>
          <div className={styles.field}>
            <label htmlFor="hotelName">Hotel Name:</label>
            <input
              type="text"
              id="hotelName"
              name="name"
              value={hotelDetails.name || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="hotelAddress">Address:</label>
            <input
              type="text"
              id="hotelAddress"
              name="address"
              value={hotelDetails.address || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkInDate">Check-In Date:</label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={hotelDetails.checkInDate?.split("T")[0] || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="checkOutDate">Check-Out Date:</label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={hotelDetails.checkOutDate?.split("T")[0] || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="roomType">Room Type:</label>
            <input
              type="text"
              id="roomType"
              name="roomType"
              value={hotelDetails.roomType || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="false"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="amenities">Amenities:</label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={hotelDetails.amenities?.join(", ") || ""}
              onChange={onAmenitiesChange}
              className={styles.input}
              placeholder="Enter amenities separated by commas"
              aria-required="false"
            />
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {hotelDetails.name || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {hotelDetails.address || "N/A"}
          </p>
          <p>
            <strong>Check-In Date:</strong>{" "}
            {hotelDetails.checkInDate
              ? new Date(hotelDetails.checkInDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Check-Out Date:</strong>{" "}
            {hotelDetails.checkOutDate
              ? new Date(hotelDetails.checkOutDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Room Type:</strong> {hotelDetails.roomType || "N/A"}
          </p>
          <p>
            <strong>Amenities:</strong>{" "}
            {hotelDetails.amenities?.join(", ") || "N/A"}
          </p>
        </>
      )}
    </div>
  );
};

Hotel.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  hotelDetails: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    checkInDate: PropTypes.string,
    checkOutDate: PropTypes.string,
    roomType: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onAmenitiesChange: PropTypes.func.isRequired,
};

export default Hotel;
