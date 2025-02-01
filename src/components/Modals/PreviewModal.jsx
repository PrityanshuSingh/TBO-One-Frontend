// src/components/Modals/PreviewModal.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./styles/PreviewModal.module.scss";

const PreviewModal = ({
  template,
  generatedData,
  agentName,
  agentContact,
  agentEmail,
  onClose,
  onPostNow,
  onSchedule,
}) => {
  const [scheduleTime, setScheduleTime] = useState("");

  // Merge placeholders
  let finalHtml = template.html;

  // If user gave a direct URL, override the default background
  if (
    generatedData.image &&
    generatedData.image.startsWith("http") &&
    finalHtml.includes("background:url(")
  ) {
    const regexBackground = /background:url\('(.*?)'\)/;
    finalHtml = finalHtml.replace(
      regexBackground,
      `background:url('${generatedData.image}')`
    );
  }

  // Replace placeholders
  finalHtml = finalHtml.replace(/{{agentName}}/g, agentName || "");
  finalHtml = finalHtml.replace(/{{agentContact}}/g, agentContact || "");
  finalHtml = finalHtml.replace(/{{agentEmail}}/g, agentEmail || "");
  finalHtml = finalHtml.replace(/{{image}}/g, generatedData.image || "");
  finalHtml = finalHtml.replace(/{{caption}}/g, ""); // We remove caption from the HTML

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalBody}>
          {/* Left column: final rendered HTML */}
          <div className={styles.previewLeft}>
            <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
          </div>

          {/* Right column: caption + scheduling */}
          <div className={styles.previewRight}>
            <h3>Caption</h3>
            <p>{generatedData.caption || "(No caption provided)"}</p>

            <h4>Schedule Later?</h4>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />

            <div className={styles.modalButtons}>
              <button
                className={styles.scheduleBtn}
                onClick={() => onSchedule(scheduleTime)}
              >
                Schedule Post
              </button>
              <button className={styles.postNowBtn} onClick={onPostNow}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
