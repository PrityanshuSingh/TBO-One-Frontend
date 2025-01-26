// src/pages/Packages/PackageCard.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaRegBookmark, FaBookmark } from 'react-icons/fa'; // Filled & empty bookmark
import { MdPlayCircle, MdPauseCircle, MdDrafts, MdDoNotDisturb } from 'react-icons/md'; // Campaign icons
import axios from 'axios';
import styles from './styles/PackageCard.module.scss';

import { AuthContext } from '../../context/AuthContext';

const PackageCard = ({
  id,
  packageTitle,
  image,
  location,
  duration,
  price,
  priceColor = 'var(--black)',
  campaignStatus,
  onDetailsClick
}) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AuthContext); // Accessing context
  const userEmail = userData?.Member?.Email;
  const savedPackages = userData?.Profile?.saved || [];

  // Local state for bookmark toggle
  const [isSaved, setIsSaved] = useState(false);

  // Check if package is already saved
  useEffect(() => {
    setIsSaved(savedPackages.includes(id));
  }, [savedPackages, id]);

  const handleWhatsAppClick = () => {
    navigate(`/packages/campaign?id=${id}`);
  };

  const handleBookmarkClick = async () => {
    if (!userEmail) return;

    try {
      const res = await axios.post('/api/package/bookmark', {
        email: userEmail,
        packageId: id
      });

      // Assuming the API returns the updated saved list
      const updatedSaved = res.data.saved || [];
      setUserData((prev) => ({
        ...prev,
        Profile: { ...prev.Profile, saved: updatedSaved }
      }));

      setIsSaved(updatedSaved.includes(id));
    } catch (err) {
      console.error('Error bookmarking package:', err);
    }
  };

  // Function to determine campaign icon
  const getCampaignIcon = () => {
    if (campaignStatus === 'Running')
      return <MdPlayCircle className={`${styles.campaignIcon} ${styles.runningIcon}`} />;
    if (campaignStatus === 'Draft')
      return <MdDrafts className={`${styles.campaignIcon} ${styles.draftIcon}`} />;
    if (campaignStatus === 'Stopped')
      return <MdPauseCircle className={`${styles.campaignIcon} ${styles.stoppedIcon}`} />;
    return <MdDoNotDisturb className={`${styles.campaignIcon} ${styles.noCampaignIcon}`} />;
  };

  return (
    <div className={styles.travelCard}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img
            loading="lazy"
            src={image}
            alt={`Travel destination ${location}`}
            className={styles.destinationImage}
          />
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
          <div className={styles.price} style={{ color: priceColor }}>
            <span className={styles.amount}>${price}</span>
            <span className={styles.perPerson}>per person</span>
          </div>
        </div>

        <div className={styles.actionsRow}>
          {/* Campaign Status Icon (Always Visible) */}
          <div className={styles.statusContainer} title={campaignStatus || "No Campaign"}>
            {getCampaignIcon()}
          </div>

          {/* WhatsApp Button */}
          <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
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
