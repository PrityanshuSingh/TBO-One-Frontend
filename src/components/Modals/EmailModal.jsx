import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import styles from "./styles/EmailModal.module.scss";

import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const EmailModal = ({
  template,
  generatedData,
  agentName,
  agentContact,
  agentEmail,
  onClose,
  onPostNow,
  onSchedule,
  packageId,       // May be passed as prop or via location.state
  packageImage,    // Ignored for email modal
  packageTitle,
  packagecaption,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};
  const { userData } = useContext(AuthContext);

  // User details from context
  const name = userData.Profile.firstName;
  const email = userData.Profile.email;
  const contact = userData.Profile.contactNumber;

  // Extract values from props or fallback to location.state
  const finalPackageId = packageId || stateData.packageId;
  const finalPackageTitle = packageTitle || stateData.packageTitle;
  const finalPackageCaption = packagecaption || stateData.packagecaption;

  // State for scheduling
  const [scheduleTime, setScheduleTime] = useState("");

  // State for campaign end time and frequency
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState("1 week");

  // Subject (initially set to packageTitle) and campaign name
  const [subjectText, setSubjectText] = useState(finalPackageTitle || "");
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [campaignName, setCampaignName] = useState(finalPackageTitle || "");
  const [isEditingCampaignName, setIsEditingCampaignName] = useState(false);

  // Recipients: set to customer emails only from userData.Profile.customer
  const initialRecipients = (userData.Profile?.customer || []).map((customer) => ({
    id: customer.id,
    email: customer.email,
  }));
  const [recipients, setRecipients] = useState(initialRecipients);
  const [newRecipient, setNewRecipient] = useState("");

  // Simple email validation regex
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle adding a new recipient on Enter key press
  const handleRecipientKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const emailInput = newRecipient.trim();
      if (isValidEmail(emailInput)) {
        const newRecip = { id: Date.now().toString(), email: emailInput };
        setRecipients([...recipients, newRecip]);
        setNewRecipient("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  // Remove a recipient chip by id
  const removeRecipient = (id) => {
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  // Email body: initially set to packagecaption before editing or AI generation
  const [emailBody, setEmailBody] = useState(finalPackageCaption || "");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Generate email body using AI
  const handleGenerateEmailBody = async () => {
    setIsGeneratingEmail(true);
    setEmailError(null);
    try {
      const payload = { packageId: finalPackageId, email };
      const response = await api.post("/api/ai/emailBody", payload);
      if (!response.data.body) {
        throw new Error("Invalid response from AI generator.");
      }
      setEmailBody(response.data.body);
    } catch (error) {
      console.error("Error generating email body:", error);
      setEmailError(error.message);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handlePackageSchedulePost = async (scheduleTime) => {
    if (!subjectText) return;
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
      subject: subjectText,
      scheduleTime,
      frequency,
      endTime,
      recipients, // Array of objects with id and email
      emailBody,
      action: "schedule",
    };
    try {
      const res = await api.post("/api/email/scheduleSend", payload);
      alert(`Email scheduled for ${scheduleTime}!`);
      handlePackageClose();
    } catch (error) {
      console.error("Failed scheduling", error);
      alert("Failed to schedule email. Possibly fallback used.");
      handlePackageClose();
    }
  };

  const handlePackagePostNow = async () => {
    if (!subjectText) return;
    console.log("packageId used in post now:", finalPackageId);
    const payload = {
      packageId: finalPackageId,
      name,
      email,
      contact,
      subject: subjectText,
      scheduleTime,
      frequency,
      endTime,
      recipients,
      emailBody,
      action: "send-now",
    };
    try {
      const res = await api.post("/api/email/send", payload);
      alert("Email sent immediately!");
      handlePackageClose();
    } catch (error) {
      console.error("Failed immediate post", error);
      alert("Failed to send email. Possibly fallback used.");
      handlePackageClose();
    }
  };

  // (Optional) If using a template, process it here.
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
    finalHtml = finalHtml.replace(/{{caption}}/g, "");
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
        <h2 className={styles.heading}>Email Campaign</h2>
        <div className={styles.modalBody}>
          {/* Here we no longer have a previewLeft for image */}
          <div className={styles.previewRight}>
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

            <h3>Subject</h3>
            {!template ? (
              isEditingSubject ? (
                <div>
                  <textarea
                    value={subjectText}
                    onChange={(e) => setSubjectText(e.target.value)}
                    className={styles.captionInput}
                    placeholder="Enter email subject here..."
                  />
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditingSubject(false)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>{subjectText || "(No subject provided)"}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => setIsEditingSubject(true)}
                  >
                    Edit Subject
                  </button>
                </div>
              )
            ) : (
              <p>{generatedData.caption || "(No subject provided)"}</p>
            )}

            <h3>Recipients</h3>
            <div className={styles.recipientsContainer}>
              {recipients.map((recipient) => (
                <div key={recipient.id} className={styles.recipientChip}>
                  <span className={styles.recipientEmail}>{recipient.email}</span>
                  <button
                    className={styles.removeRecipientButton}
                    onClick={() => removeRecipient(recipient.id)}
                    aria-label={`Remove ${recipient.email}`}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Type email and press Enter..."
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={handleRecipientKeyDown}
                className={styles.recipientInput}
              />
            </div>

            <h3>Email Body</h3>
            <div className={styles.emailBodyContainer}>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className={styles.emailBodyTextarea}
                placeholder="Enter email body..."
              />
              {isGeneratingEmail && <div className={styles.spinner}></div>}
              <button
                className={styles.aiGenerateButton}
                onClick={handleGenerateEmailBody}
                aria-label="Generate Email Body with AI"
                disabled={isGeneratingEmail}
              >
                <FiRefreshCw size={20} />
                {isGeneratingEmail
                  ? "Generating..."
                  : "Generate Email Body with AI"}
              </button>
              {emailError && (
                <div className={styles.errorText}>{emailError}</div>
              )}
            </div>

            <h3>Schedule Later?</h3>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />

            {!template && (
              <>
                <h3>Frequency of Email</h3>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                </select>
                <h3>Email Campaign End Time</h3>
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
                      Schedule Email
                    </button>
                  )}
                  <button className={styles.postNowBtn} onClick={onPostNow}>
                    Send Email
                  </button>
                </>
              ) : (
                <>
                  {scheduleTime && (
                    <button
                      className={styles.scheduleBtn}
                      onClick={() => handlePackageSchedulePost(scheduleTime)}
                    >
                      Schedule Email
                    </button>
                  )}
                  <button
                    className={styles.postNowBtn}
                    onClick={handlePackagePostNow}
                  >
                    Send Email
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

export default EmailModal;
