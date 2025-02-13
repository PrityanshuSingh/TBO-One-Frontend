// src/pages/SocialMedia/SocialMedia.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { FaCross, FaInstagram } from "react-icons/fa";
import axios from "axios";
import api from "../../utils/api";
import Template from "../../components/Cards/TemplateCard";
import PreviewModal from "../../components/Modals/InstagramModal";
import templatesData from "../../data/localTemplates.json";
import styles from "./styles/SocialMedia.module.scss";
import { FaTimes } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

const typeFilterOptions = [
  "ALL",
  "Festive",
  "Destination",
  "Brand",
  "Scenic",
  "Quiz",
  "Trends",
];
const segmentFilterOptions = ["ALL", "post", "ad"];
const socialFilterOptions = ["ALL", "instagram", "twitter"];

const SocialMedia = () => {
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  const { userData } = useContext(AuthContext);
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
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [imageHostedUrl, setImageHostedUrl] = useState("");

  // Preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  useEffect(() => {
    checkInstagramConnection();
  }, []);

  async function checkInstagramConnection() {
    try {
      const res = await api.get("/api/instagram/status", {
        params: { agentId: userData?.id },
      });
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
    

    const agentId = userData?.id;
  
    // Append agentId as a query parameter to the connect endpoint
    const authUrl = `${import.meta.env.VITE_API_BASE_URL}/api/instagram/connect?agentId=${agentId}`;
  
    // Open a new popup for the OAuth flow
    const popup = window.open(
      authUrl,
      "instagramAuthWindow",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},status=no,toolbar=no,menubar=no`
    );
  
    // Poll to see if the popup has closed, then check Instagram connection
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
        console.warn(
          "Failed to fetch templates from API, using fallback data.",
          error
        );
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

  const handleGenerateImageAi = async () => {
    if (!imageQuery.trim()) {
      alert("Please enter a prompt for AI image generation.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const payload = { prompt: imageQuery.trim() };
      const res = await api.post("/api/ai/image", payload);
      // Store the generated image URL without modifying the prompt
      setGeneratedImage(res.data.imageUrl);
      setImagePreview(true);
    } catch (err) {
      console.error("Error generating AI image:", err);
      alert("Failed AI image. Using fallback image instead.");
      const fallbackUrl = `https://via.placeholder.com/400?text=AIFallback:${encodeURIComponent(imageQuery)}`;
      setGeneratedImage(fallbackUrl);
      setImagePreview(true);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImagePreview = () => {
    setImagePreview((prev) => !prev);
  };

  const handleGetPostImageLink = async (base64Image) => {
    try {
      const formData = new FormData();
      formData.append("image", base64Image);
  
      const res = await api.post("/api/ai/hostImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return res.data.imageURL;
    
    } catch (err) {
      console.error("Error hosting image:", err);
      alert("Failed to get hosted image link.");
    }
  };

  const handleGetImageLink = async (base64Image) => {
    try {
      const formData = new FormData();
      formData.append("image", base64Image);
  
      const res = await api.post("/api/ai/hostImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  

      // console.log("Hosted Image URL:", res.data.imageURL);
      // Assuming your backend returns { hostedUrl: "https://..." }
      setImageHostedUrl(res.data.imageURL);
      alert(`Hosted Image URL: ${res.data.imageURL}`);
      setImageQuery(res.data.imageURL);
    } catch (err) {
      console.error("Error hosting image:", err);
      alert("Failed to get hosted image link.");
    }
  };
  
  
  // AI or manual generation for image & caption
  const handleGenerateCaptionAi = async () => {
    if (!generatedImage) {
      alert("Please generate an image first to help AI captioning.");
      return;
    }
    
    // Create a FormData instance
    const formData = new FormData();
    formData.append("imageUrl", generatedImage); // send the image as a field
    formData.append("prompt", captionQuery.trim());
  
    try {
      const res = await api.post("/api/ai/caption", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCaptionQuery(res.data.caption);
    } catch (err) {
      console.error("Error generating AI caption:", err);
      alert("Failed AI caption. Using fallback text.");
      setCaptionQuery(`(Fallback) AI-Generated Caption from: ${imageQuery}`);
    }
  };

  const handleGeneratePreview = () => {
    if (!imageQuery.trim() && !captionQuery.trim()) {
      alert("Please provide a caption or an image before generating preview.");
      return;
    }
    // let finalImageUrl = "";
    // if (imageQuery.startsWith("http")) {
    //   finalImageUrl = imageQuery.trim();
    // } else {
    //   finalImageUrl = `https://via.placeholder.com/400?text=AI+${encodeURIComponent(imageQuery)}`;
    // }
    setGeneratedData({
      image: imageQuery,
      caption: captionQuery,
    });
    setShowPreviewModal(true);
  };

  // Called by PreviewModal => "Post Now"
  const handlePostNow = async (finalHtml) => {
    if (!selectedTemplate || !generatedData) return;
  
    // Create a temporary container for your HTML string
    const container = document.createElement("div");
    
    container.style.position = "absolute";
    container.style.top = "0px"; // you can also use top: 0
    container.style.left = "0px";
    container.style.zIndex = "-1000"; // send it behind other content
    container.style.backgroundColor = "#fff"; // set a background if needed

    container.innerHTML = finalHtml;
    
    // Append the container to the document body so that it becomes part of the DOM.
    document.body.appendChild(container);
  
    // Optionally wait a short moment to ensure the browser has rendered the content.
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    try {
      const canvas = await html2canvas(container, {
        useCORS: true, // if needed for images
        backgroundColor: null, // to capture transparency if desired
      });
  
      // Convert the canvas to a Base64-encoded image string.
      const base64Image = canvas.toDataURL("image/png");
      console.log("Base64 image generated:", base64Image);
  
      // Remove the temporary container from the DOM now that we have the snapshot.
      document.body.removeChild(container);
  
      // Continue with your posting logic using the base64Image.
      const resImage = await handleGetPostImageLink(base64Image);
      console.log("Image hosted successfully. Proceeding to post the campaign...");
  
      const payload = {
        agentId: userData?.id,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        agentName,
        agentContact,
        agentEmail,
        image: resImage,
        caption: generatedData.caption,
        action: "post-now",
      };
  
      await api.post("/api/instagram/personalPost", payload);
      alert("Post published immediately! Check your connected Instagram.");
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Failed immediate post", error);
      // Make sure to remove the container even on error
      if (container.parentNode) {
        document.body.removeChild(container);
      }
      alert("Failed to post now. Possibly fallback used.");
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
      agentId: userData?.id,
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
      const res = await api.post("/api/instagram/personalPost", payload);
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
            <button
              className={styles.generateButton}
              onClick={handleGenerateImageAi}
              disabled={isGeneratingImage}
            >
              {isGeneratingImage
                ? "Generating AI Image..."
                : generatedImage
                  ? "Regenerate AI Image"
                  : "AI Generate Image"}
            </button>
            {generatedImage && (
              <>
              <button
                className={styles.previewButton}
                onClick={() => setImagePreview(true)}
              >
                Preview Image
              </button>
              <button
        className={styles.previewButton}
        onClick={() => handleGetImageLink(generatedImage)}
      >
        Get Image Link
      </button>
              </>
            )}
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
            <button
              className={styles.generateButton}
              onClick={handleGenerateCaptionAi}
            >
              AI Generate Caption & Tags
            </button>
          </div>

          <button
            className={styles.previewButton}
            onClick={handleGeneratePreview}
          >
            Generate Preview
          </button>
        </div>
      )}

      {imagePreview && (
        <div className={styles.previewModal}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={handleImagePreview}>
              <FaTimes size={24} />
            </button>
            <img
              src={generatedImage}
              alt="Generated Preview"
              className={styles.previewImage}
            />
          </div>
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
