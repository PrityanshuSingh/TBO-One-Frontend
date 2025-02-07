// src/components/WhatsAppModal/WhatsAppModal.jsx

import React, { useState, useContext, useMemo } from "react";
import styles from "./styles/WhatsAppModal.module.scss";
import WhatsAppEditor from "../Socials/WhatsApp/Editor/WhatsAppEditor";
import WhatsAppContactManager from "../Socials/WhatsApp/ContactManager/WhatsAppContactManager";
import { AuthContext } from '../../context/AuthContext'; // Assuming AuthContext is defined and provides traveler details

const WhatsAppModal = ({ isOpen, onClose, packageData }) => {
  const { userData, updateUserData } = useContext(AuthContext); // Access traveler details from AuthContext
  const travelerMobile = userData?.Profile?.contactNumber || "";
  const travelerEmail = userData?.Profile?.email || "";

  const [step, setStep] = useState(1);

  // State Variables for WhatsAppEditor
  const [title, setTitle] = useState(packageData.title || "");
    const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState(
    packageData.detailedDescription || ""
  );
  const [packageId, setPackageId] = useState(packageData.id || "");
  const [scheduleDay, setScheduleDay] = useState(packageData.scheduleDay || "");
  const [scheduleTime, setScheduleTime] = useState(
    packageData.scheduleTime || ""
  );

  // Handle image as an object { file: File | null, preview: string }
  const [packageImage, setPackageImage] = useState({
    file: null,
    preview: packageData.image || "",
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleImageChange = ({ file, preview }) => {
    setPackageImage({ file, preview });
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleCampaignChange = (newName) => {
    setCampaignName(newName);
  };
  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
  };

  const handleScheduleDayChange = (newDay) => {
    setScheduleDay(newDay);
  };

  const handleScheduleTimeChange = (newTime) => {
    setScheduleTime(newTime);
  };

  const baseUrl = window.location.origin;

  // Compute previewMessage using useMemo for performance optimization
  const previewMessage = useMemo(() => {
    return `Check out this package: ${title}
Location: ${packageData.location || ""}
Price: ${packageData?.currency || ""} ${packageData?.price || ""}
Duration: ${packageData.duration || ""}
Description: ${description}
Details: ${baseUrl}/packages/details?id=${packageId}&email=${travelerEmail}
Travelers: ${travelerMobile}, ${travelerEmail}`;
  }, [title, packageData.location, packageData.price, packageData.currency, description, packageId, travelerMobile, travelerEmail]);

  return (
    isOpen && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close Modal"
          >
            ✕
          </button>

          {step === 1 ? (
            <WhatsAppEditor
              onNext={handleNext}
              packageImage={packageImage}
              onImageChange={handleImageChange}
              packageTitle={title}
              onCampaignChange={handleCampaignChange}
              campaignName={campaignName}
              onTitleChange={handleTitleChange}
              title={title}
              description={description}
              onDescriptionChange={handleDescriptionChange}
              packageId={packageId}
              scheduleDay={scheduleDay}
              onScheduleDayChange={handleScheduleDayChange}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={handleScheduleTimeChange}
              location={packageData.location || ""}
              price={packageData?.price || ""} 
              currency={packageData?.currency || ""}
              duration={packageData.duration || ""} 
              travelerMobile={travelerMobile}    
              travelerEmail={travelerEmail}        
            />
          ) : (
            <WhatsAppContactManager
              message={previewMessage}
              campaignName={campaignName}
              title={title}
              image={packageImage} // Pass the image object
              packageId={packageId}
              description={description}
              scheduleDay={scheduleDay}
              scheduleTime={scheduleTime}
              onBack={handleBack}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    )
  );
};

export default WhatsAppModal;
