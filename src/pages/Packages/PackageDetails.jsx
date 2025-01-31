// src/pages/PackageDetails/PackageDetails.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../utils/api";

import styles from "./styles/PackageDetails.module.scss";

import fallbackData from "../../data/localPackages.json";

// Importing all sub-components
import Header from "../../components/Sections/PackageDetails/Header/Header";
import ImageSection from "../../components/Sections/PackageDetails/ImageSection/ImageSection";
import BasicDetails from "../../components/Sections/PackageDetails/BasicDetails/BasicDetails";
import PriceDetails from "../../components/Sections/PackageDetails/PriceDetails/PriceDetails";
import Flights from "../../components/Sections/PackageDetails/Flights/Flights";
import Hotel from "../../components/Sections/PackageDetails/Hotel/Hotel";
import Sightseeing from "../../components/Sections/PackageDetails/Sightseeing/Sightseeing";
import Transport from "../../components/Sections/PackageDetails/Transport/Transport";
import Itinerary from "../../components/Sections/PackageDetails/Itinerary/Itinerary";
import AdditionalServices from "../../components/Sections/PackageDetails/AdditionalServices/AdditionalService";
import FAQs from "../../components/Sections/PackageDetails/FAQs/FAQs";

// New imports
import InterestModal from "../../components/Modals/InterestModal";

// Import AuthContext
import { AuthContext } from "../../context/AuthContext"; // Adjust path as necessary

const PackageDetails = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // Extract email if present
  const { id: paramId } = useParams(); // Extract package ID from URL if authenticated
  const queryId = queryParams.get("id"); // Extract package ID from URL if not authenticated

  const id = paramId || queryId; // Determine the final ID
  const { isAuthenticated } = useContext(AuthContext); // Get authentication status

  const [packageData, setPackageData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  // Fetch package details on mount
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await api.get(`/u/packages/details/${id}`);
        setPackageData(response.data);
        setEditedData(response.data);
      } catch (err) {
        const fallbackPackage = fallbackData.find((pkg) => pkg.id === id);
        if (fallbackPackage) {
          setPackageData(fallbackPackage);
          setEditedData(fallbackPackage);
        } else {
          setError("Package not found.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackageDetails();
  }, [id]);

  // Handle input changes for BasicDetails
  const handleBasicDetailsChange = (e, arrayKey = null) => {
    const { name, value } = e.target;

    if (name === "recommendationTags") {
      const tags = value.split(",").map((tag) => tag.trim());
      setEditedData((prev) => ({
        ...prev,
        recommendationTags: tags,
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle input changes for PriceDetails
  const handlePriceDetailsChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: value,
      },
    }));
  };

  // Handle Flight changes
  const handleFlightChange = (groupIndex, flightIndex, field, value) => {
    setEditedData((prev) => {
      const updatedFlights = [...prev.details.flights];
      updatedFlights[groupIndex][flightIndex] = {
        ...updatedFlights[groupIndex][flightIndex],
        Airline: {
          ...updatedFlights[groupIndex][flightIndex].Airline,
          [field]: value,
        },
      };
      return {
        ...prev,
        details: {
          ...prev.details,
          flights: updatedFlights,
        },
      };
    });
  };

  // Handle Sightseeing changes
  const handleSightseeingChange = (index, name, value) => {
    setEditedData((prev) => {
      const updatedSightseeing = [...prev.details.sightseeing];
      if (name === "SightseeingTypes") {
        updatedSightseeing[index].SightseeingTypes = value
          .split(",")
          .map((type) => type.trim());
      } else {
        updatedSightseeing[index][name] = value;
      }
      return {
        ...prev,
        details: {
          ...prev.details,
          sightseeing: updatedSightseeing,
        },
      };
    });
  };

  // Handle Itinerary changes
  const handleItineraryChange = (index, name, value) => {
    setEditedData((prev) => {
      const updatedItinerary = [...prev.details.itinerary];
      if (name === "activities") {
        updatedItinerary[index].activities = value
          .split(",")
          .map((activity) => activity.trim());
      } else {
        updatedItinerary[index][name] = value;
      }
      return {
        ...prev,
        details: {
          ...prev.details,
          itinerary: updatedItinerary,
        },
      };
    });
  };

  // Handle Transport changes
  const handleTransportChange = (type, name, value) => {
    setEditedData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        transport: {
          ...prev.details.transport,
          airportTransfers: {
            ...prev.details.transport.airportTransfers,
            [type]: {
              ...prev.details.transport.airportTransfers[type],
              [name]: value,
            },
          },
        },
      },
    }));
  };

  // Handle Additional Services changes
  const handleAdditionalServicesChange = (name, value) => {
    let parsedValue = value;
    if (name === "travelInsurance" || name === "visaAssistance") {
      parsedValue = value === "true";
    }

    setEditedData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        additionalServices: {
          ...prev.details.additionalServices,
          [name]: parsedValue,
        },
      },
    }));
  };

  // Handle FAQs changes
  const handleFAQChange = (index, name, value) => {
    setEditedData((prev) => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index][name] = value;
      return { ...prev, faqs: updatedFaqs };
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      setEditedData(packageData); // Reset edited data when cancelling edit
      setSaveError("");
    }
    setIsEditMode(!isEditMode);
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      // Send the entire editedData JSON to the backend
      await api.put(`/u/packages/details/${id}`, editedData);
      setPackageData(editedData);
      setIsEditMode(false);
    } catch (err) {
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Interest button click
  const handleInterestClick = () => {
    setIsInterestModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsInterestModalOpen(false);
  };

  // Handle Interest form submission
  const handleInterestSubmit = async (formData) => {
    try {
      await api.post(`/u/packages/interested`, {
        packageId: id,
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
        suggestions: formData.suggestions,
      });
      alert("Your personalized package will be sent to you soon.");
      setIsInterestModalOpen(false);
    } catch (err) {
      alert("Failed to send your interest. Please try again.");
    }
  };

  // Render loading, error, or no data states
  if (isLoading) {
    return <div className={styles.loading}>Loading package details...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!packageData) {
    return <div className={styles.noData}>No package data available.</div>;
  }

  return (
    <div className={styles.packageDetailsContainer}>
      <Header
        title="Package Details"
        isEditMode={isEditMode}
        onEdit={toggleEditMode}
        onSave={handleSave}
        onCancel={toggleEditMode}
        isSaving={isSaving}
        isAuthenticated={isAuthenticated}
        onInterestClick={handleInterestClick}
      />

      {saveError && <div className={styles.saveError}>{saveError}</div>}

      <div className={styles.content}>
        {/* Image Section */}
        <ImageSection
          image={isEditMode ? editedData.image : packageData.image}
          isEditMode={isEditMode}
          onImageChange={handleImageChange}
        />

        {/* Basic Details */}
        <BasicDetails
          isEditMode={isEditMode}
          basicDetails={isEditMode ? editedData : packageData}
          onChange={handleBasicDetailsChange}
        />

        {/* Price Details */}
        <PriceDetails
          isEditMode={isEditMode}
          priceDetails={isEditMode ? editedData.price : packageData.price}
          onChange={handlePriceDetailsChange}
        />

        {/* Details Section */}
        <div className={styles.detailsSection}>
          <h2>Trip Details</h2>

          {/* Flights */}
          <Flights
            isEditMode={isEditMode}
            flights={isEditMode ? editedData?.details?.flights : packageData?.details?.flights}
            onFlightChange={handleFlightChange}
          />

          {/* Hotel */}
          <Hotel
            isEditMode={isEditMode}
            hotelDetails={isEditMode ? editedData?.details?.hotel : packageData?.details?.hotel}
            onChange={handlePriceDetailsChange}
            onAmenitiesChange={handleBasicDetailsChange}
          />

          {/* Sightseeing */}
          <Sightseeing
            isEditMode={isEditMode}
            sightseeing={isEditMode ? editedData?.details?.sightseeing : packageData?.details?.sightseeing}
            onSightseeingChange={handleSightseeingChange}
          />

          {/* Transport */}
          <Transport
            isEditMode={isEditMode}
            transportDetails={isEditMode ? editedData?.details?.transport : packageData?.details?.transport}
            onTransportChange={handleTransportChange}
          />

          {/* Itinerary */}
          <Itinerary
            isEditMode={isEditMode}
            itinerary={isEditMode ? editedData?.details?.itinerary : packageData?.details?.itinerary}
            onItineraryChange={handleItineraryChange}
          />

          {/* Additional Services */}
          <AdditionalServices
            isEditMode={isEditMode}
            additionalServices={isEditMode ? editedData?.details?.additionalServices : packageData?.details?.additionalServices}
            onChange={handleAdditionalServicesChange}
          />

          {/* FAQs */}
          <FAQs
            isEditMode={isEditMode}
            faqs={isEditMode ? editedData?.faqs : packageData?.faqs}
            onFAQChange={handleFAQChange}
          />
        </div>
      </div>

      {/* Interest Modal */}
      {isInterestModalOpen && (
        <InterestModal
          onClose={handleModalClose}
          onSubmit={handleInterestSubmit}
        />
      )}
    </div>
  );
};

export default PackageDetails;
