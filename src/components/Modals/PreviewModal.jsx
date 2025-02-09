// src/components/Modals/PreviewModal.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import styles from "./styles/PreviewModal.module.scss";

import api from "../../utils/api";
import {AuthContext} from "../../context/AuthContext";

const PreviewModal = ({
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
  // If props are not passed directly, try to use location state
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};
  const {userData} = useContext(AuthContext);

  const name=userData.Profile.firstName;
  const email=userData.Profile.email;
  const contact=userData.Profile.contactNumber;

  // Use either the passed prop or the state data.
  const finalPackageImage = packageImage || stateData.packageImage;
  const finalPackageTitle = packageTitle || stateData.packageTitle;
  const finalPackageCaption = packagecaption || stateData.packagecaption;
  const [scheduleTime, setScheduleTime] = useState("");

  const handlePackageSchedulePost = async (scheduleTime) => {
    if (!finalPackageCaption || !finalPackageImage) return;
    if (!scheduleTime) {
      alert("Please select a date/time for scheduling.");
      return;
    }
    const payload = {
      packageId,
      name,
      email,
      contact,
      image: finalPackageImage,
      caption: finalPackageCaption,
      scheduleTime,
      action: "schedule",
    };
    try {
      const res = await api.post("/api/social/schedulePost", payload);
      alert(`Post scheduled for ${scheduleTime}!`);
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Failed scheduling", error);
      alert("Failed to schedule post. Possibly fallback used.");
      setShowPreviewModal(false);
    }
  };

  const handlePackagePostNow = async () => {
    if (!finalPackageCaption || !finalPackageImage) return;
    const payload = {
      packageId,
      name,
      email,
      contact,
      image: finalPackageImage,
      caption: finalPackageCaption,
      scheduleTime,
      action: "post-now",
    };
    try {
      const res = await api.post("/api/social/post", payload);
      alert("Post published immediately!");
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Failed immediate post", error);
      alert("Failed to post now. Possibly fallback used.");
      setShowPreviewModal(false);
    }
  };

  let finalHtml = "";
  if (template) {
    finalHtml = template.html;

    console.log(finalHtml);
console.log(generatedData);

if (
  generatedData?.image &&
  generatedData.image.startsWith("http") &&
  finalHtml.includes("background:")
) {
  const regexBackground = /(background:\s*url\(')(.*?)('\))/;
  finalHtml = finalHtml.replace(regexBackground, `$1${generatedData.image}$3`);
}

console.log(finalHtml);


    finalHtml = finalHtml.replace(/{{agentName}}/g, agentName || "");
    finalHtml = finalHtml.replace(/{{agentContact}}/g, agentContact || "");
    finalHtml = finalHtml.replace(/{{agentEmail}}/g, agentEmail || "");
    finalHtml = finalHtml.replace(/{{image}}/g, generatedData.image || "");
    finalHtml = finalHtml.replace(/{{caption}}/g, ""); // Caption is handled separately
  }

  const handlePackageClose = () => {
    navigate("/u/packages");
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {template?(
          <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        ):(
          <button className={styles.closeButton} onClick={handlePackageClose}>
          <FaTimes />
        </button>
        )}
        

        <div className={styles.modalBody}>
          {/* Left column: final rendered HTML or package image preview */}
          <h4>Instagram Preview</h4>
          <div className={styles.previewLeft}>
            {template ? (
              <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
            ) : (
              <div className={styles.packageImage}>
                <img src={finalPackageImage} alt="Package" />
              </div>
            )}
          </div>

          {/* Right column: caption and scheduling */}
          <div className={styles.previewRight}>
            <h4>Caption</h4>
            {template ? (
              <p>{generatedData.caption || "(No caption provided)"}</p>
            ) : (
              <p>{finalPackageCaption || "(No caption provided)"}</p>
            )}

            <h4>Schedule Later?</h4>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />

            <div className={styles.modalButtons}>
              {template ? (
                <>
                  <button
                    className={styles.scheduleBtn}
                    onClick={() => onSchedule(scheduleTime)}
                  >
                    Schedule Post
                  </button>
                  <button className={styles.postNowBtn} onClick={onPostNow}>
                    Post
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.scheduleBtn}
                    onClick={() => handlePackageSchedulePost(scheduleTime)}
                  >
                    Schedule Post
                  </button>
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

export default PreviewModal;
