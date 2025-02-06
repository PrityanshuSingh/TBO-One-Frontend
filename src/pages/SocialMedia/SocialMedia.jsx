// src/pages/SocialMedia/SocialMedia.jsx

import React, { useState, useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import api from "../../utils/api";
import Template from "../../components/Cards/TemplateCard";
import PreviewModal from "../../components/Modals/PreviewModal";
import templatesData from "../../data/localTemplates.json";
import styles from "./styles/SocialMedia.module.scss";

const typeFilterOptions = ["ALL", "Festive", "Destination", "Brand", "Scenic", "Quiz", "Trends"];
const segmentFilterOptions = ["ALL", "post", "ad"];
const socialFilterOptions = ["ALL", "instagram", "twitter"];

const SocialMedia = () => {
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);

  // Example agent data
  const agentName = "Rohit Sharma";
  const agentContact = "+91 (22) 9876-5432";
  const agentEmail = "rohit.sharma@tbotravels.com";

  // Filter states
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [segmentFilter, setSegmentFilter] = useState("ALL");
  const [socialFilter, setSocialFilter] = useState("ALL");

  // Template selection & user inputs
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [imageQuery, setImageQuery] = useState("");
  const [captionQuery, setCaptionQuery] = useState("");

  // Preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

   useEffect(() => {
    checkInstagramConnection();
  }, []);

  async function checkInstagramConnection() {
    try {
      const res = await api.get("/api/instagram/status");
      if (res.data?.connected) {
        setIsInstagramConnected(true);
      } else {
        setIsInstagramConnected(false);
      }
    } catch (err) {
      console.warn("Unable to check Instagram status:", err);
      setIsInstagramConnected(false);
    }
  }

  const handleInstagramAuth = () => {
    const popupWidth = 600;
    const popupHeight = 700;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;

    const authUrl = `${import.meta.env.VITE_API_BASE_URL}/api/instagram/connect`;

    // Open a new popup for the OAuth flow
    const popup = window.open(
      authUrl,
      "instagramAuthWindow",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},status=no,toolbar=no,menubar=no`
    );

    // Poll to see if user is connected once the popup closes
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        checkInstagramConnection();
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get("/api/ai/templates");
        setTemplates(response.data || []);
      } catch (error) {
        console.warn("Failed to fetch templates from API, using fallback data.", error);
        setTemplates(templatesData);
      }
    };

    fetchTemplates();
  }, []);

  // Filter the templates by type, segment, and social
  const filteredTemplates = templates.filter((tpl) => {
    if (typeFilter !== "ALL" && tpl.type !== typeFilter) return false;
    if (segmentFilter !== "ALL" && tpl.segment !== segmentFilter) return false;
    if (socialFilter !== "ALL" && tpl.social !== socialFilter) return false;
    return true;
  });

  // Select a template
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setImageQuery("");
    setCaptionQuery("");
  };

  const handleCloseCustomization = () => {
    setSelectedTemplate(null);
    setImageQuery("");
    setCaptionQuery("");
  };

  // AI or manual generation for image & caption
  const handleGenerateCaptionAi = async () => {
    if (!imageQuery.trim()) {
      alert("Please enter an image prompt (or URL) first to help AI captioning.");
      return;
    }
    const payload = { prompt: imageQuery.trim() };
    try {
      const res = await api.post("/api/ai/caption", payload);
      setCaptionQuery(res.data.caption);
    } catch (err) {
      console.error("Error generating AI caption:", err);
      alert("Failed AI caption. Using fallback text.");
      setCaptionQuery(`(Fallback) AI-Generated Caption from: ${imageQuery}`);
    }
  };

  const handleGenerateImageAi = async () => {
    if (!imageQuery.trim()) {
      alert("Please enter a prompt for AI image generation.");
      return;
    }
    const payload = { prompt: imageQuery.trim() };
    try {
      const res = await api.post("/api/ai/image", payload);
      setImageQuery(res.data.imageUrl); // Suppose the server returns { imageUrl: "..." }
    } catch (err) {
      console.error("Error generating AI image:", err);
      alert("Failed AI image. Using fallback image instead.");
      const fallbackUrl = `https://via.placeholder.com/400?text=AIFallback:${encodeURIComponent(imageQuery)}`;
      setImageQuery(fallbackUrl);
    }
  };

  const handleGeneratePreview = () => {
    if (!imageQuery.trim() && !captionQuery.trim()) {
      alert("Please provide a caption or an image before generating preview.");
      return;
    }
    let finalImageUrl = "";
    if (imageQuery.startsWith("http")) {
      finalImageUrl = imageQuery.trim();
    } else {
      finalImageUrl = `https://via.placeholder.com/400?text=AI+${encodeURIComponent(imageQuery)}`;
    }
    setGeneratedData({
      image: finalImageUrl,
      caption: captionQuery,
    });
    setShowPreviewModal(true);
  };

  // Called by PreviewModal => "Post Now"
  const handlePostNow = async () => {
    if (!selectedTemplate || !generatedData) return;
    const payload = {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      agentName,
      agentContact,
      agentEmail,
      image: generatedData.image,
      caption: generatedData.caption,
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

  // Called by PreviewModal => "Schedule"
  const handleSchedulePost = async (scheduleTime) => {
    if (!selectedTemplate || !generatedData) return;
    if (!scheduleTime) {
      alert("Please select a date/time for scheduling.");
      return;
    }
    const payload = {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      agentName,
      agentContact,
      agentEmail,
      image: generatedData.image,
      caption: generatedData.caption,
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

  return (
    <div className={styles.socialMediaContainer}>
      {/* Header */}
      <div className={styles.fixedHeader}>
        <div className={styles.headingArea}>
          <h1>Social Media Templates</h1>
          <p>Customize and schedule your Instagram posts (and more)</p>
        </div>

        {/* Instagram Connect Button */}
        <div className={styles.socialIcons}>
          <button
            onClick={handleInstagramAuth}
            title={
              isInstagramConnected
                ? "Instagram is connected!"
                : "Connect your Instagram Business Account"
            }
            className={
              isInstagramConnected
                ? styles.instagramBtnConnected
                : styles.instagramBtn
            }
          >
            <FaInstagram size={24} />
          </button>
          {isInstagramConnected && (
            <span className={styles.connectedTag}>IG Connected</span>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label>Type:</label>
          {typeFilterOptions.map((option) => (
            <button
              key={option}
              className={typeFilter === option ? styles.activeFilter : ""}
              onClick={() => setTypeFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <label>Segment:</label>
          {segmentFilterOptions.map((option) => (
            <button
              key={option}
              className={segmentFilter === option ? styles.activeFilter : ""}
              onClick={() => setSegmentFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <label>Social:</label>
          {socialFilterOptions.map((option) => (
            <button
              key={option}
              className={socialFilter === option ? styles.activeFilter : ""}
              onClick={() => setSocialFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className={styles.templatesGrid}>
        {filteredTemplates.length === 0 ? (
          <div>No templates match your filters.</div>
        ) : (
          filteredTemplates.map((template) => (
            <Template
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
              isSelected={selectedTemplate?.id === template.id}
            />
          ))
        )}
      </div>

      {/* If a template is selected, show customization UI */}
      {selectedTemplate && (
        <div className={styles.inputSection}>
          <div className={styles.customizeHeader}>
            <h2>Customize Template: {selectedTemplate.name}</h2>
            <button
              className={styles.closeCustomizationBtn}
              onClick={handleCloseCustomization}
            >
              Close
            </button>
          </div>

          {/* AI image generation */}
          <label>Image Prompt or URL</label>
          <input
            type="text"
            placeholder="Use AI prompt or paste image URL..."
            value={imageQuery}
            onChange={(e) => setImageQuery(e.target.value)}
          />
          <div className={styles.aiActions}>
            <button className={styles.generateButton} onClick={handleGenerateImageAi}>
              AI Generate Image
            </button>
          </div>

          {/* AI caption generation */}
          <label>Caption</label>
          <input
            type="text"
            placeholder="Write your caption or let AI do it"
            value={captionQuery}
            onChange={(e) => setCaptionQuery(e.target.value)}
          />
          <div className={styles.aiActions}>
            <button className={styles.generateButton} onClick={handleGenerateCaptionAi}>
              AI Generate Caption & Tags
            </button>
          </div>

          <button className={styles.previewButton} onClick={handleGeneratePreview}>
            Generate Preview
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && generatedData && (
        <PreviewModal
          template={selectedTemplate}
          generatedData={generatedData}
          agentName={agentName}
          agentContact={agentContact}
          agentEmail={agentEmail}
          onClose={() => setShowPreviewModal(false)}
          onPostNow={handlePostNow}
          onSchedule={handleSchedulePost}
        />
      )}
    </div>
  );
};

export default SocialMedia;
