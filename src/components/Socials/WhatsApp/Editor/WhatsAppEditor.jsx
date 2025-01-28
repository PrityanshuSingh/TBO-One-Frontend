// src/components/WhatsAppModal/WhatsAppEditor.jsx

import React, { useRef, useState } from 'react';
import styles from './styles/WhatsAppEditor.module.scss';
import { FiEdit, FiRefreshCw } from 'react-icons/fi'; // Importing React Icons

const WhatsAppEditor = ({
  message,
  onMessageChange,
  onNext,
  packageImage,
  onImageChange, // Updated to handle both File and Preview URL
  packageTitle,
  onTitleChange,
  title,
  description,
  onDescriptionChange,
  packageId,
  scheduleDay,
  onScheduleDayChange,
  scheduleTime,
  onScheduleTimeChange,
}) => {
  const fileInputRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Handler to trigger the hidden file input
  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  // Handler for image selection
  const handleImageSelection = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const previewURL = URL.createObjectURL(selectedFile);
      onImageChange({ file: selectedFile, preview: previewURL });
      // Note: You can handle file upload here if needed
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

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.heading}>Edit WhatsApp Message</h2>
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
        </div>

        {/* Details Section */}
        <div className={styles.detailsContainer}>
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
            <label htmlFor="description">Detailed Description</label>
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

          {/* Package Details Link */}
          <div className={styles.detailItem}>
            <label htmlFor="packageLink">Package Details Link</label>
            <input
              type="text"
              id="packageLink"
              value={`package/details/${packageId}`}
              className={styles.inputField}
              aria-label="Package Details Link"
              readOnly
            />
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

      {/* WhatsApp Message Box */}
      <textarea 
        value={message} 
        onChange={(e) => onMessageChange(e.target.value)} 
        className={styles.messageBox} 
        placeholder="Edit your message here..."
        aria-label="WhatsApp Message"
      />

      {/* Next Button */}
      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={!message.trim()} // Disable if message is empty
        aria-label="Next"
      >
        Next
      </button>
    </div>
  );
};

export default WhatsAppEditor;
