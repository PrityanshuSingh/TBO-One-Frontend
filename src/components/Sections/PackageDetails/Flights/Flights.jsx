// src/components/Flights/Flights.jsx

import React from "react";
import PropTypes from "prop-types";

import FlightItem from "./FlightItem";

import styles from "./styles/Flights.module.scss";

const Flights = ({
  isEditMode,
  flights,
  onFlightChange,
}) => {
    console.log("f",flights);
  return (
    <div className={`${styles.subSection} ${styles.flights}`}>
      <h3>Flights</h3>
      {isEditMode ? (
        <>
          {flights?.map((flightGroup, groupIndex) => (
            <div key={groupIndex} className={styles.fieldGroup}>
              {flightGroup.map((flight, flightIndex) => (
                <FlightItem
                  key={flightIndex}
                  groupIndex={groupIndex}
                  flightIndex={flightIndex}
                  flight={flight}
                  onFlightChange={onFlightChange}
                />
              ))}
            </div>
          ))}
        </>
      ) : (
        flights?.map((flightGroup, groupIndex) => (
          <div key={groupIndex} className={styles.fieldGroup}>
            {flightGroup.map((flight, flightIndex) => (
              <FlightItem
                key={flightIndex}
                groupIndex={groupIndex}
                flightIndex={flightIndex}
                flight={flight}
                isEditMode={false}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

Flights.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  flights: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
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
      })
    )
  ).isRequired,
  onFlightChange: PropTypes.func,
};

Flights.defaultProps = {
  onFlightChange: () => {},
};

export default Flights;
