// src/components/Flights/FlightItem.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/FlightItem.module.scss";

const FlightItem = ({
  groupIndex,
  flightIndex,
  flight,
  isEditMode,
  onFlightChange,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFlightChange(groupIndex, flightIndex, name, value);
  };

  // Fallback: if Segments exists, take the first segment of the first group; otherwise, use flight directly.
  const segment = flight.Segments?.[0]?.[0] || flight;

  if (!segment) {
    return (
      <div className={styles.flight}>
        <p className={styles.errorText}>Flight details are unavailable.</p>
      </div>
    );
  }

  const { Airline = {}, Origin = {}, Destination = {}, Duration } = segment;
  const { AirlineName = "N/A", AirlineCode = "N/A", FlightNumber = "N/A" } =
    Airline;
  const { Airport: OriginAirport = {}, DepTime } = Origin;
  const { Airport: DestinationAirport = {}, ArrTime } = Destination;
  const {
    CityName: OriginCity = "N/A",
    AirportCode: OriginCode = "N/A",
  } = OriginAirport;
  const {
    CityName: DestinationCity = "N/A",
    AirportCode: DestinationCode = "N/A",
  } = DestinationAirport;

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.flight}>
      <h4 className={styles.flightTitle}>Flight from {OriginCity}</h4>
      <div className={styles.field}>
        <label htmlFor={`AirlineCode-${groupIndex}-${flightIndex}`}>
          Airline Details:
        </label>
        {isEditMode ? (
          <input
            type="text"
            id={`AirlineCode-${groupIndex}-${flightIndex}`}
            name="AirlineCode"
            value={AirlineCode}
            onChange={handleChange}
            className={`${styles.input} ${
              !AirlineCode ? styles.inputError : ""
            }`}
            aria-required="true"
            placeholder="Enter Airline Code"
          />
        ) : (
          <p className={styles.text}>
            <strong>Airline:</strong> {AirlineName} ({AirlineCode}) -{" "}
            {FlightNumber}
          </p>
        )}
      </div>
      {isEditMode ? (
        <>
          <div className={styles.field}>
            <label htmlFor={`AirlineName-${groupIndex}-${flightIndex}`}>
              Airline Name:
            </label>
            <input
              type="text"
              id={`AirlineName-${groupIndex}-${flightIndex}`}
              name="AirlineName"
              value={AirlineName}
              onChange={handleChange}
              className={`${styles.input} ${
                !AirlineName ? styles.inputError : ""
              }`}
              aria-required="true"
              placeholder="Enter Airline Name"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`FlightNumber-${groupIndex}-${flightIndex}`}>
              Flight Number:
            </label>
            <input
              type="text"
              id={`FlightNumber-${groupIndex}-${flightIndex}`}
              name="FlightNumber"
              value={FlightNumber}
              onChange={handleChange}
              className={`${styles.input} ${
                !FlightNumber ? styles.inputError : ""
              }`}
              aria-required="true"
              placeholder="Enter Flight Number"
            />
          </div>
          {/* Add additional editable fields here if necessary */}
        </>
      ) : (
        <>
          <div className={styles.field}>
            <p className={styles.text}>
              <strong>From:</strong> {OriginCity} ({OriginCode}) at{" "}
              {formatDateTime(DepTime)}
            </p>
          </div>
          <div className={styles.field}>
            <p className={styles.text}>
              <strong>To:</strong> {DestinationCity} ({DestinationCode}) at{" "}
              {formatDateTime(ArrTime)}
            </p>
          </div>
          <div className={styles.field}>
            <p className={styles.text}>
              <strong>Duration:</strong> {Duration || "N/A"} minutes
            </p>
          </div>
          <div className={styles.field}>
            <p className={styles.text}>
              <strong>Fare:</strong> {flight?.Fare?.Currency}{" "}
              {flight?.Fare?.BaseFare}
            </p>
          </div>
          {/* Display flight segments if available */}
          {flight.Segments && flight.Segments.length > 0 && (
            <div className={styles.segments}>
              <h5>Segments:</h5>
              {flight.Segments.map((segmentGroup, sgIndex) => (
                <div key={sgIndex} className={styles.segmentGroup}>
                  {segmentGroup.map((seg, segIndex) => (
                    <div key={segIndex} className={styles.segment}>
                      <p>
                        <strong>
                          {segIndex === 0 ? "Departure" : "Arrival"}:
                        </strong>{" "}
                        {seg?.Origin?.Airport?.CityName || "N/A"} (
                        {seg?.Origin?.Airport?.AirportCode || "N/A"}) to{" "}
                        {seg?.Destination?.Airport?.CityName || "N/A"} (
                        {seg?.Destination?.Airport?.AirportCode || "N/A"})
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {formatDateTime(seg?.Origin?.DepTime)} -{" "}
                        {formatDateTime(seg?.Destination?.ArrTime)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

FlightItem.propTypes = {
  groupIndex: PropTypes.number.isRequired,
  flightIndex: PropTypes.number.isRequired,
  flight: PropTypes.shape({
    Segments: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    Airline: PropTypes.shape({
      AirlineCode: PropTypes.string,
      AirlineName: PropTypes.string,
      FlightNumber: PropTypes.string,
    }),
    Origin: PropTypes.shape({
      Airport: PropTypes.shape({
        CityName: PropTypes.string,
        AirportCode: PropTypes.string,
      }),
      DepTime: PropTypes.string,
    }),
    Destination: PropTypes.shape({
      Airport: PropTypes.shape({
        CityName: PropTypes.string,
        AirportCode: PropTypes.string,
      }),
      ArrTime: PropTypes.string,
    }),
    Duration: PropTypes.number,
    FlightStatus: PropTypes.string,
    Fare: PropTypes.shape({
      Currency: PropTypes.string,
      BaseFare: PropTypes.number,
    }),
  }).isRequired,
  isEditMode: PropTypes.bool,
  onFlightChange: PropTypes.func,
};

FlightItem.defaultProps = {
  isEditMode: false,
  onFlightChange: () => {},
};

export default FlightItem;
