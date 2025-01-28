// src/components/WhatsAppModal/WhatsAppModal.jsx

import React, { useState } from "react";
import styles from "./styles/WhatsAppModal.module.scss";
import WhatsAppEditor from "../Socials/WhatsApp/Editor/WhatsAppEditor";
import WhatsAppContactManager from "../Socials/WhatsApp/ContactManager/WhatsAppContactManager";

const WhatsAppModal = ({ isOpen, onClose, packageData }) => {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(
    `Check out this package: ${packageData.title}`
  );

  // State Variables for WhatsAppEditor
  const [title, setTitle] = useState(packageData.title || "");
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

  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  };

  const handleImageChange = ({ file, preview }) => {
    setPackageImage({ file, preview });
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
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
              message={message}
              onMessageChange={handleMessageChange}
              onNext={handleNext}
              packageImage={packageImage}
              onImageChange={handleImageChange}
              packageTitle={title}
              onTitleChange={handleTitleChange}
              title={title}
              description={description}
              onDescriptionChange={handleDescriptionChange}
              packageId={packageId}
              scheduleDay={scheduleDay}
              onScheduleDayChange={handleScheduleDayChange}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={handleScheduleTimeChange}
            />
          ) : (
            <WhatsAppContactManager
              message={message}
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
