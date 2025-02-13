import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/Hotel.module.scss";

const Hotel = ({ isEditMode, hotelDetails, onChange, onAmenitiesChange }) => {
  // Assume hotelDetails is an array with one hotel object.
  const hotel = hotelDetails[0] || {};

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
              name="HotelName"
              value={hotel.HotelName || ""}
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
              name="Address"
              value={hotel.Address || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="checkInTime">Check-In Time:</label>
            <input
              type="text"
              id="checkInTime"
              name="CheckInTime"
              value={hotel.CheckInTime || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="checkOutTime">Check-Out Time:</label>
            <input
              type="text"
              id="checkOutTime"
              name="CheckOutTime"
              value={hotel.CheckOutTime || ""}
              onChange={onChange}
              className={styles.input}
              aria-required="true"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="Description"
              value={hotel.Description || ""}
              onChange={onChange}
              className={styles.textarea}
              aria-required="false"
            />
          </div>

          <div className={`${styles.field} ${styles.facilitiesField}`}>
            <label htmlFor="facilities">Facilities:</label>
            <div className={styles.facilitiesInputWrapper}>
              <input
                type="text"
                id="facilities"
                name="HotelFacilities"
                value={
                  hotel.HotelFacilities
                    ? hotel.HotelFacilities.join(", ")
                    : ""
                }
                onChange={onAmenitiesChange}
                className={styles.input}
                placeholder="Enter facilities separated by commas"
                aria-required="false"
              />
            </div>
            {hotel.HotelFacilities && hotel.HotelFacilities.length > 0 && (
              <div className={styles.facilitiesChips}>
                {hotel.HotelFacilities.map((facility, index) => (
                  <span key={index} className={styles.chip}>
                    {facility}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {hotel.HotelName || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {hotel.Address || "N/A"}
          </p>
          <p>
            <strong>Check-In Time:</strong> {hotel.CheckInTime || "N/A"}
          </p>
          <p>
            <strong>Check-Out Time:</strong> {hotel.CheckOutTime || "N/A"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {hotel.Description ? (
              <span
                dangerouslySetInnerHTML={{ __html: hotel.Description }}
              />
            ) : (
              "N/A"
            )}
          </p>
          <div className={styles.facilitiesDisplay}>
            <strong>Facilities:</strong>
            {hotel.HotelFacilities && hotel.HotelFacilities.length > 0 ? (
              <div className={styles.facilitiesChips}>
                {hotel.HotelFacilities.map((facility, index) => (
                  <span key={index} className={styles.chip}>
                    {facility}
                  </span>
                ))}
              </div>
            ) : (
              " N/A"
            )}
          </div>
        </>
      )}
    </div>
  );
};

Hotel.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  hotelDetails: PropTypes.arrayOf(
    PropTypes.shape({
      HotelCode: PropTypes.string,
      HotelName: PropTypes.string,
      Description: PropTypes.string,
      HotelFacilities: PropTypes.arrayOf(PropTypes.string),
      Address: PropTypes.string,
      PinCode: PropTypes.string,
      CityId: PropTypes.string,
      CountryName: PropTypes.string,
      PhoneNumber: PropTypes.string,
      FaxNumber: PropTypes.string,
      Map: PropTypes.string,
      HotelRating: PropTypes.number,
      CityName: PropTypes.string,
      CountryCode: PropTypes.string,
      CheckInTime: PropTypes.string,
      CheckOutTime: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onAmenitiesChange: PropTypes.func.isRequired,
};

export default Hotel;
