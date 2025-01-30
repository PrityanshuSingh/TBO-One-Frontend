// src/components/WhatsAppModal/WhatsAppEditor.jsx

import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './styles/WhatsAppEditor.module.scss';
import { FiEdit, FiRefreshCw } from 'react-icons/fi'; // Importing React Icons
import { AuthContext } from '../../../../context/AuthContext';

const WhatsAppEditor = ({
  onNext,
  packageImage,
  onImageChange, // Handles both File and Preview URL
  packageTitle,
  onTitleChange,
  onCampaignChange,
  campaignName,
  title,
  description,
  onDescriptionChange,
  packageId,
  scheduleDay,
  onScheduleDayChange,
  scheduleTime,
  onScheduleTimeChange,
  location,
  price,    
  duration,
  travelerMobile,
  travelerEmail,
}) => {
  const fileInputRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const { userData } = useContext(AuthContext);
  let email = userData?.Profile?.email;

  // Handler to trigger the hidden file input
  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  const handleImageSelection = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const previewURL = URL.createObjectURL(selectedFile);
  
      console.log("Selected File:", selectedFile); // Debugging
  
      onImageChange({ file: selectedFile, preview: previewURL });
    }
  };
  

  // Handler for AI-generated description
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description.');
      }

      const data = await response.json();
      if (data.description) {
        onDescriptionChange(data.description);
      } else {
        throw new Error('Invalid response from AI generator.');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      setAiError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clean up the object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (packageImage.preview) {
        URL.revokeObjectURL(packageImage.preview);
      }
    };
  }, [packageImage.preview]);

  // Construct the preview message dynamically
  const baseUrl = window.location.origin; // Dynamically get the base URL
  const previewMessage = `Check out this package: ${title}
  
Location: ${location}
Price: ${price.basePrice}
Duration: ${duration}

${description}

Details: ${baseUrl}/packages/details/${packageId}
Travelers: ${travelerMobile}, ${travelerEmail}`;

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.heading}>Run WhatsApp Campaign</h2>
      <div className={styles.contentWrapper}>
        {/* Image Section */}
        <div className={styles.imageContainer}>
          {packageImage.preview ? (
            <img src={packageImage.preview} alt={packageTitle} className={styles.packageImage} />
          ) : (
            <img src={packageImage} alt={packageTitle} className={styles.packageImage} />
          )}
          <button
            className={styles.editImageButton}
            onClick={handleEditImage}
            aria-label="Edit Image"
          >
            <FiEdit size={20} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageSelection}
          />
          {/* Preview Message */}
          <div className={styles.previewMessage}>
            <p><strong>Check out this package:</strong> {title}</p>
            <br/>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Price:</strong> {price}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <br/>
            <p className={styles.wpDescription}>{description}</p>
            <br/>
            <p><strong>Details:</strong> <a href={`${baseUrl}/packages/details?id=${packageId}&email=${email}`} target="_blank" rel="noopener noreferrer">View Package</a></p>
            <p><strong>Travelers:</strong> {travelerMobile}, {travelerEmail}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.detailsContainer}>

          {/* Campaign Name */}
          <div className={styles.detailItem}>
            <label htmlFor="campaignName">Campaign Name</label>
            <input
              type="text"
              id="campaignName"
              value={campaignName}
              onChange={(e) => onCampaignChange(e.target.value)}
              className={styles.inputField}
              aria-label="Campaign Name"
            />
          </div>

          {/* Package Title */}
          <div className={styles.detailItem}>
            <label htmlFor="packageTitle">Package Title</label>
            <input
              type="text"
              id="packageTitle"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={styles.inputField}
              aria-label="Package Title"
            />
          </div>

          {/* WhatsApp Description */}
          <div className={styles.detailItem}>
            <label htmlFor="description">WhatsApp Description</label>
            <div className={styles.descriptionWrapper}>
              <textarea
                id="description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className={styles.textareaField}
                placeholder="Edit your description here..."
                aria-label="WhatsApp Description"
              />
              <button
                className={styles.aiGenerateButton}
                onClick={handleGenerateDescription}
                aria-label="Generate Description with AI"
                disabled={isGenerating}
              >
                <FiRefreshCw size={20} />
                {isGenerating && <span className={styles.spinner}></span>}
              </button>
            </div>
            {aiError && <div className={styles.errorText}>{aiError}</div>}
          </div>

          {/* Schedule Day */}
          <div className={styles.detailItem}>
            <label htmlFor="scheduleDay">Schedule Day</label>
            <input
              type="date"
              id="scheduleDay"
              value={scheduleDay}
              onChange={(e) => onScheduleDayChange(e.target.value)}
              className={styles.inputField}
              aria-label="Schedule Day"
            />
          </div>

          {/* Schedule Time */}
          <div className={styles.detailItem}>
            <label htmlFor="scheduleTime">Schedule Time</label>
            <input
              type="time"
              id="scheduleTime"
              value={scheduleTime}
              onChange={(e) => onScheduleTimeChange(e.target.value)}
              className={styles.inputField}
              aria-label="Schedule Time"
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={!description.trim() || !title.trim()} // Disable if title or description is empty
        aria-label="Next"
      >
        Next
      </button>
    </div>
  );
};

export default WhatsAppEditor;
