import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import styles from "./styles/InstagramModal.module.scss";

import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const InstagramModal = ({
  template,
  generatedData,
  agentName,
  agentContact,
  agentEmail,
  onClose,
  onPostNow,
  onSchedule,
  packageId,
  packageImage,
  packageTitle,
  packagecaption,
}) => {
  // Get location state if available
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};
  const { userData } = useContext(AuthContext);

  const name = userData.Profile.firstName;
  const email = userData.Profile.email;
  const contact = userData.Profile.contactNumber;

  // Extract values either from props or location state
  const finalPackageId = packageId || stateData.packageId;
  const finalPackageImage = packageImage || stateData.packageImage;
  const finalPackageTitle = packageTitle || stateData.packageTitle;
  const finalPackageCaption = packagecaption || stateData.packagecaption;

  // Existing state for scheduling
  const [scheduleTime, setScheduleTime] = useState("");

  // NEW: State for campaign end time and frequency
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState("1 week");

  // State for caption editing (only used when no template)
  const [captionText, setCaptionText] = useState(finalPackageCaption || "");
  const [isEditingCaption, setIsEditingCaption] = useState(false);

  // State for campaign name editing (only used when no template)
  const [campaignName, setCampaignName] = useState(finalPackageTitle || "");
  const [isEditingCampaignName, setIsEditingCampaignName] = useState(false);

  // NEW: State for generating caption via AI
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionError, setCaptionError] = useState(null);

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    setCaptionError(null);
    try {
      const payload = { packageId: finalPackageId, email };
      const response = await api.post("/api/ai/instagrampackageCaption", payload);
      if (!response.data.caption) {
        throw new Error("Invalid response from AI generator.");
      }
      setCaptionText(response.data.caption);
    } catch (error) {
      console.error("Error generating caption:", error);
      setCaptionError(error.message);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handlePackageSchedulePost = async (scheduleTime) => {
    if (!captionText || !finalPackageImage) return;
    if (!scheduleTime) {
      alert("Please select a date/time for scheduling.");
      return;
    }
    console.log("packageId used in schedule:", finalPackageId);
    const payload = {
      packageId: finalPackageId,
      name,
      email,
      contact,
      image: finalPackageImage,
      caption: captionText,
      scheduleTime,
      frequency,
      endTime,
      action: "schedule",
    };
    try {
      const res = await api.post("/api/instagram/schedulePost", payload);
      alert(`Post scheduled for ${scheduleTime}!`);
      handlePackageClose();
    } catch (error) {
      console.error("Failed scheduling", error);
      alert("Failed to schedule post. Possibly fallback used.");
      handlePackageClose();
    }
  };

  const handlePackagePostNow = async () => {
    if (!captionText || !finalPackageImage) return;
    console.log("packageId used in post now:", finalPackageId);
    const payload = {
      packageId: finalPackageId,
      name,
      email,
      contact,
      image: finalPackageImage,
      caption: captionText,
      scheduleTime,
      frequency,
      endTime,
      action: "post-now",
    };
    try {
      const res = await api.post("/api/instagram/post", payload);
      alert("Post published immediately!");
      handlePackageClose();
    } catch (error) {
      console.error("Failed immediate post", error);
      alert("Failed to post now. Possibly fallback used.");
      handlePackageClose();
    }
  };

  let finalHtml = "";
  if (template) {
    finalHtml = template.html;
    console.log("Template HTML:", finalHtml);
    console.log("Generated Data:", generatedData);
    if (
      generatedData?.image &&
      generatedData.image.startsWith("http") &&
      finalHtml.includes("background:")
    ) {
      const regexBackground = /(background:\s*url\(')(.*?)('\))/;
      finalHtml = finalHtml.replace(regexBackground, `$1${generatedData.image}$3`);
    }
    console.log("Final HTML:", finalHtml);
    finalHtml = finalHtml.replace(/{{agentName}}/g, agentName || "");
    finalHtml = finalHtml.replace(/{{agentContact}}/g, agentContact || "");
    finalHtml = finalHtml.replace(/{{agentEmail}}/g, agentEmail || "");
    finalHtml = finalHtml.replace(/{{image}}/g, generatedData.image || "");
    finalHtml = finalHtml.replace(/{{caption}}/g, ""); // Caption is handled separately
  }

  const handlePackageClose = () => {
    navigate("/u/packages");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {template ? (
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        ) : (
          <button className={styles.closeButton} onClick={handlePackageClose}>
            <FaTimes />
          </button>
        )}

        {template ? (
          <h2 className={styles.heading}>Instagram Post</h2>
        ) : (
          <h2 className={styles.heading}>Instagram Campaign</h2>
        )}

        <div className={styles.modalBody}>
          {/* Left section: rendered HTML (if template) or package image preview */}
          <div className={styles.previewLeft}>
            {template ? (
              <div>
                <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
              </div>
            ) : (
              <div className={styles.packageImage}>
                <img src={finalPackageImage} alt="Package" />
              </div>
            )}
          </div>

          {/* Right section: caption and scheduling details */}
          <div className={styles.previewRight}>
            {/* Show Campaign Name only when template is not present */}
            {!template && (
              <>
                <h3>Campaign Name</h3>
                {isEditingCampaignName ? (
                  <div>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className={styles.campaignNameInput}
                    />
                    <button
                      className={styles.editButton}
                      onClick={() => setIsEditingCampaignName(false)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{campaignName || "(No campaign name provided)"}</p>
                    <button
                      className={styles.editButton}
                      onClick={() => setIsEditingCampaignName(true)}
                    >
                      Edit Campaign Name
                    </button>
                  </div>
                )}
              </>
            )}

            <h3>Caption</h3>
            {!template ? (
              isEditingCaption ? (
                <div>
                  <textarea
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    className={styles.captionInput}
                  />
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditingCaption(false)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>{captionText || "(No caption provided)"}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditingCaption(true)}
                  >
                    Edit Caption
                  </button>
                </div>
              )
            ) : (
              <p>{generatedData.caption || "(No caption provided)"}</p>
            )}

            {/* New button to generate caption via AI */}
            <button
              className={styles.aiGenerateButton}
              onClick={handleGenerateCaption}
              disabled={isGeneratingCaption}
              aria-label="Generate Caption with AI"
            >
              <FiRefreshCw size={20} />
              {isGeneratingCaption
                ? "Generating Caption..."
                : "Generate Caption with AI"}
            </button>
            {captionError && (
              <div className={styles.errorText}>{captionError}</div>
            )}

            <h3>Schedule Later?</h3>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />

            {!template && (
              <>
                <h3>Frequency of Post</h3>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                </select>

                <h3>Campaign End Time</h3>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </>
            )}

            <div className={styles.modalButtons}>
              {template ? (
                <>
                  {scheduleTime && (
                    <button
                      className={styles.scheduleBtn}
                      onClick={() => onSchedule(scheduleTime)}
                    >
                      Schedule Post
                    </button>
                  )}
                  <button className={styles.postNowBtn} onClick={onPostNow}>
                    Post
                  </button>
                </>
              ) : (
                <>
                  {scheduleTime && (
                    <button
                      className={styles.scheduleBtn}
                      onClick={() => handlePackageSchedulePost(scheduleTime)}
                    >
                      Schedule Post
                    </button>
                  )}
                  <button
                    className={styles.postNowBtn}
                    onClick={handlePackagePostNow}
                  >
                    Post
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramModal;
