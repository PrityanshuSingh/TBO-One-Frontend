// src/pages/SocialMedia/SocialMedia.jsx

import React, { useState, useEffect } from 'react';
import { FaInstagram, FaXing } from 'react-icons/fa';
import api from '../../utils/api';
import Template from '../../components/Cards/TemplateCard';
import PreviewModal from '../../components/Modals/PreviewModal';
import templatesData from '../../data/localTemplates.json';
import styles from './styles/SocialMedia.module.scss';

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
  const [imageQuery, setImageQuery] = useState("");
  const [captionQuery, setCaptionQuery] = useState("");

  // Preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  // On mount, check if there's an Instagram code in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code) {
      api.post('/auth/instagram/callback', { code })
        .then(() => {
          setIsInstagramConnected(true);
          // Remove the code param from URL
          window.history.replaceState(null, '', window.location.pathname);
        })
        .catch(() => {
          alert('Failed to connect Instagram.');
        });
    }
  }, []);

  const handleInstagramAuth = () => {
    const hostname = window.location.hostname;
    window.location.href = `${hostname}/auth/instagram`;
  };

  // Filter the templates by type, segment, and social
  const filteredTemplates = templatesData.filter((tpl) => {
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

  const handleGenerateCaptionAi = async () => {
    if (!imageQuery.trim()) {
      alert("Please enter an image prompt (or URL) first.");
      return;
    }
    const payload = { prompt: imageQuery.trim() };
    try {
      const res = await api.post('/api/genai/caption', payload);
      setCaptionQuery(res.data.caption);
    } catch (err) {
      console.error("Error from /api/genai/caption:", err);
      alert("Failed to generate AI caption. Using fallback data.");
      // Fallback
      setCaptionQuery(`(Fallback) AI-Generated Caption from "${imageQuery}"`);
    }
  };

  const handleGenerateImageAi = async () => {
    if (!imageQuery.trim()) {
      alert("Please enter a prompt for AI image generation.");
      return;
    }
    const payload = { prompt: imageQuery.trim() };
    try {
      const res = await api.post('/api/genai/image', payload);
      // Suppose the server responds with { imageUrl: "..." }
      setImageQuery(res.data.imageUrl);
    } catch (err) {
      console.error("Error from /api/genai/image:", err);
      alert("Failed to generate AI image. Using fallback data.");
      // Fallback
      const fallbackUrl = `https://via.placeholder.com/400?text=AI+for:${encodeURIComponent(imageQuery)}`;
      setImageQuery(fallbackUrl);
    }
  };


  const handleGeneratePreview = () => {
    if (!imageQuery.trim() && !captionQuery.trim()) {
      alert("Please provide a caption or an image query/URL.");
      return;
    }
    let finalImageUrl = "";
    if (imageQuery.trim()) {
      if (imageQuery.startsWith("http")) {
        finalImageUrl = imageQuery.trim();
      } else {
        // Possibly an AI placeholder
        finalImageUrl = `https://via.placeholder.com/300?text=AI+for:${encodeURIComponent(imageQuery)}`;
      }
    }
    const responseData = {
      image: finalImageUrl,
      caption: captionQuery
    };
    setGeneratedData(responseData);
    setShowPreviewModal(true);
  };


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
      action: 'post-now'
    };
    try {
      const res = await api.post('/api/social/postNow', payload);
      // If success
      alert("Post published immediately!");
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Failed immediate post", error);
      alert("Failed to post now. Using fallback response instead.");
      // Fallback
      setShowPreviewModal(false);
    }
  };


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
      action: 'schedule'
    };
    try {
      const res = await api.post('/api/social/schedule', payload);
      alert(`Post scheduled for ${scheduleTime}!`);
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Failed scheduling", error);
      alert("Failed to schedule post. Fallback: scheduled in local DB (simulated).");
      // Fallback
      setShowPreviewModal(false);
    }
  };

  return (
    <div className={styles.socialMediaContainer}>
      {/* Header */}
      <div className={styles.fixedHeader}>
        <div className={styles.headingArea}>
          <h1>Social Media Templates</h1>
          <p>Customize and schedule your Instagram or Twitter posts</p>
        </div>
        <div className={styles.socialIcons}>
          <button onClick={handleInstagramAuth} title="Connect Instagram">
            <FaInstagram size={24} />
          </button>
          {!isInstagramConnected && (
            <span className={styles.connectedTag}>Connected</span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label>Type:</label>
          {typeFilterOptions.map((option) => (
            <button
              key={option}
              // highlight if active
              className={typeFilter === option ? "active" : ""}
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
              className={segmentFilter === option ? "active" : ""}
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
              className={socialFilter === option ? "active" : ""}
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
          <div>No templates available for these filters.</div>
        ) : (
          filteredTemplates.map((template) => (
            <Template
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
              isSelected={selectedTemplate && selectedTemplate.id === template.id}
            />
          ))
        )}
      </div>

      {/* Customization if a template is selected */}
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
          <label>Image (Prompt or URL)</label>
          <input
            type="text"
            placeholder="Use AI prompt or enter image URL..."
            value={imageQuery}
            onChange={(e) => setImageQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', margin: '6px 0 12px' }}>
            <button
              className={styles.generateButton}
              onClick={handleGenerateImageAi}
            >
              Generate AI Image
            </button>
          </div>

          <label>Caption</label>
          <input
            type="text"
            placeholder="Type your caption or use AI..."
            value={captionQuery}
            onChange={(e) => setCaptionQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', margin: '6px 0 12px' }}>
            <button
              className={styles.generateButton}
              onClick={handleGenerateCaptionAi}
            >
              Generate AI Caption & Tags
            </button>
          </div>

          <button className={styles.generateButton} onClick={handleGeneratePreview}>
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
