import React, { useRef, useState, useEffect, useContext } from 'react';
import styles from './styles/WhatsAppEditor.module.scss';
import { FiEdit, FiRefreshCw } from 'react-icons/fi';
import { AuthContext } from '../../../../context/AuthContext';
import api from '../../../../utils/api';

const WhatsAppEditor = ({
  onNext,
  packageImage,
  onImageChange,
  packageTitle,
  onTitleChange,
  onCampaignChange,
  campaignName,
  title,
  description,
  onDescriptionChange,
  packageId,
  scheduleDateTime,
  onScheduleDateTimeChange,
  frequency,
  onFrequencyChange,
  campaignEnd,
  onCampaignEndChange,
  location,
  price,    
  currency,
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
  
      console.log("Selected File:", selectedFile);
  
      onImageChange({ file: selectedFile, preview: previewURL });
    }
  };

  // Handler for AI-generated description
  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const payload = { packageId: packageId, email: email };
      const response = await api.post('/api/ai/wpDescription', payload);
  
      if (!response.data.caption) {
        throw new Error('Invalid response from AI generator.');
      }
  
      const caption = response.data.caption;
      onDescriptionChange(caption);
  
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

  const baseUrl = window.location.origin;

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.heading}>WhatsApp Campaign</h2>
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
            <p><strong>Price:</strong> {currency} {price}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <br/>
            <p className={styles.wpDescription}>{description}</p>
            <br/>
            <p>
              <strong>Details:</strong>{" "}
              <a href={`${baseUrl}/packages/details?pid=${packageId}`} target="_blank" rel="noopener noreferrer">
                View Package
              </a>
            </p>
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

          {/* Schedule Date and Time */}
          <div className={styles.detailItem}>
            <label htmlFor="scheduleDateTime">Schedule Date & Time</label>
            <input
              type="datetime-local"
              id="scheduleDateTime"
              value={scheduleDateTime}
              onChange={(e) => onScheduleDateTimeChange(e.target.value)}
              className={styles.inputField}
              aria-label="Schedule Date & Time"
            />
          </div>

          {/* Frequency of Message */}
          <div className={styles.detailItem}>
            <label htmlFor="frequency">Frequency of Message</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value)}
              className={styles.inputField}
              aria-label="Frequency of Message"
              style={{width:"100%"}}
            >
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
            </select>
          </div>

          {/* Campaign End Date */}
          <div className={styles.detailItem}>
            <label htmlFor="campaignEnd">Campaign End Date</label>
            <input
              type="datetime-local"
              id="campaignEnd"
              value={campaignEnd}
              onChange={(e) => onCampaignEndChange(e.target.value)}
              className={styles.inputField}
              aria-label="Campaign End Date"
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={!description.trim() || !title.trim()}
        aria-label="Next"
      >
        Next
      </button>
    </div>
  );
};

export default WhatsAppEditor;
