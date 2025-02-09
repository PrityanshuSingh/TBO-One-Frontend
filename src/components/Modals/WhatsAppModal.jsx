import React, { useState, useContext, useMemo } from "react";
import styles from "./styles/WhatsAppModal.module.scss";
import WhatsAppEditor from "../Socials/WhatsApp/Editor/WhatsAppEditor";
import WhatsAppContactManager from "../Socials/WhatsApp/ContactManager/WhatsAppContactManager";
import { AuthContext } from "../../context/AuthContext";

const WhatsAppModal = ({ isOpen, onClose, packageData }) => {
  const { userData, updateUserData } = useContext(AuthContext);
  const travelerMobile = userData?.Profile?.contactNumber || "";
  const travelerEmail = userData?.Profile?.email || "";

  const [step, setStep] = useState(1);
  console.log("Package Data:", packageData);

  // State Variables for WhatsAppEditor
  const [title, setTitle] = useState(packageData.title || "");
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState(packageData.detailedDescription || "");
  const [packageId, setPackageId] = useState(packageData.id || "");
  
  // Combine schedule date and time into one input
  const [scheduleDateTime, setScheduleDateTime] = useState(packageData.scheduleDateTime || "");
  const [frequency, setFrequency] = useState("1 week");
  const [campaignEnd, setCampaignEnd] = useState("");

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

  const handleScheduleDateTimeChange = (newDateTime) => {
    setScheduleDateTime(newDateTime);
  };

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);
  };

  const handleCampaignEndChange = (newEnd) => {
    setCampaignEnd(newEnd);
  };

  // Compute previewMessage using useMemo for performance optimization
  const previewMessage = useMemo(() => {
    return `Check out this package: ${title}
Location: ${packageData.location || ""}
Price: ${packageData?.currency || ""} ${packageData?.price || ""}
Duration: ${packageData.duration || ""}
Description: ${description}
Details: "View Details link"
Travelers: ${travelerMobile}, ${travelerEmail}`;
  }, [
    title,
    packageData.location,
    packageData.price,
    packageData.currency,
    description,
    packageId,
    travelerMobile,
    travelerEmail,
  ]);

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
              scheduleDateTime={scheduleDateTime}
              onScheduleDateTimeChange={handleScheduleDateTimeChange}
              frequency={frequency}
              onFrequencyChange={handleFrequencyChange}
              campaignEnd={campaignEnd}
              onCampaignEndChange={handleCampaignEndChange}
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
              scheduleDateTime={scheduleDateTime}
              frequency={frequency}
              campaignEnd={campaignEnd}
              detailsUrl={`https://tbo-one.vercel.app/packages/details?id=${packageId}&email=${travelerEmail}`}
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
