// src/components/Cards/PackageCard.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdPlayCircle, MdPauseCircle, MdDrafts, MdDoNotDisturb } from "react-icons/md";
import api from "../../utils/api";
import styles from "./styles/PackageCard.module.scss";

import { AuthContext } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";

const PackageCard = ({
  id,
  packageTitle,
  image,
  location,
  duration,
  price,
  currency,
  campaignStatus,
  onDetailsClick,
}) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);

  const userEmail = userData?.Profile?.email;
  const savedPackages = userData?.Profile?.saved || [];

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(savedPackages.includes(id));
  }, [savedPackages, id]);

  const handleBookmarkClick = async () => {
    if (!userEmail) return;
    try {
      const res = await api.post("/api/packages/bookmark", { email: userEmail, packageId: id });
      const updatedSaved = res.data.saved || [];
      setUserData((prev) => ({
        ...prev,
        Profile: { ...prev.Profile, saved: updatedSaved },
      }));
      setIsSaved(updatedSaved.includes(id));
    } catch (err) {
      console.error("Error bookmarking package:", err);
    }
  };

  const getCampaignIcon = () => {
    if (campaignStatus === "Running")
      return <MdPlayCircle className={`${styles.campaignIcon} ${styles.runningIcon}`} />;
    if (campaignStatus === "Hold")
      return <MdDrafts className={`${styles.campaignIcon} ${styles.draftIcon}`} />;
    if (campaignStatus === "Stopped")
      return <MdPauseCircle className={`${styles.campaignIcon} ${styles.stoppedIcon}`} />;
    return <MdDoNotDisturb className={`${styles.campaignIcon} ${styles.noCampaignIcon}`} />;
  };

  // Updated WhatsApp button handler
  const handleWhatsAppClick = () => {
    // If the package has a running campaign, navigate to the edit page with campaign details.
    if (campaignStatus === "Running") {
      const runningCampaign = campaigns.find((c) => c.pkgId === id && c.status === "Running");
      if (runningCampaign) {
        navigate(`/u/campaigns`, { state: { campaign: runningCampaign } });
        return;
      }
    }
    // Otherwise, use the existing behavior.
    navigate(`/u/packages/campaign/${id}`, {
      state: { id, title: packageTitle, image, location, price, currency, duration },
    });
  };

  return (
    <div className={styles.travelCard}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img loading="lazy" src={image} alt={`Travel destination ${location}`} className={styles.destinationImage} />
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.titleRow}>
            <div className={styles.packageTitle}>{packageTitle}</div>
            <button className={styles.saveButton} onClick={handleBookmarkClick}>
              {isSaved ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
            </button>
          </div>
          <div className={styles.location}>{location}</div>
          <div className={styles.duration}>{duration}</div>
          <div className={styles.price} style={{ color: "green" }}>
            <span className={styles.amount}>{currency} {price}</span>
            <span className={styles.perPerson}>per person</span>
          </div>
        </div>

        <div className={styles.actionsRow}>
          {/* Campaign Status Icon */}
          <div className={styles.statusContainer} title={campaignStatus || "No Campaign"}>
            {getCampaignIcon()}
          </div>

          {/* WhatsApp Button: Updated behavior */}
          <button
            className={styles.whatsappButton}
            onClick={handleWhatsAppClick}
          >
            <FaWhatsapp size={18} />
          </button>

          {/* Details Button */}
          <button className={styles.detailsButton} onClick={onDetailsClick}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
