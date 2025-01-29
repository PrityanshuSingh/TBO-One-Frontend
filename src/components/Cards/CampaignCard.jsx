import React, { useState,useContext } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./styles/CampaignCard.module.scss";

import { AuthContext } from "../../context/AuthContext";

const CampaignCard = ({
  campaign,
  index,
  isSelected,
  onSelect,
  groups,
  contacts,
  packageTitle,
}) => {
  const navigate = useNavigate();
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { userData } = useContext(AuthContext);
  let email = userData?.Profile?.email;
  const baseUrl = window.location.origin; 


  const handleEdit = () => {
    navigate(`/campaigns/edit/${campaign.pkgId}`);
  };

  return (
    <tr className={styles.campaignRow}>
      <td className={styles.checkbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(campaign.id)}
          aria-label={`Select campaign ${index + 1}`}
        />
      </td>
      <td className={styles.number}>{index + 1}</td>
      <td className={styles.campaignName}>{campaign.name || `Campaign ${campaign.id}`}</td>

      <td className={`${styles.status} ${styles[campaign.status.toLowerCase()]}`}>
        {campaign.status}
      </td>

      <td className={styles.packageName}>{packageTitle || "N/A"}</td>

      {/* Groups Section with Dropdown */}
      <td
        className={`${styles.groups} ${isGroupOpen ? styles.open : ""}`}
        onClick={() => setIsGroupOpen(!isGroupOpen)}
      >
        {groups.length > 0 ? (
          <>
            <div className={styles.tooltipContainer}>
              {!isGroupOpen && groups.length > 2
                ? `${groups.slice(0, 2).join(", ")}...`
                : groups.join(", ")}
            </div>
            {isGroupOpen && (
              <div className={styles.dropdownContent}>
                <strong>Groups:</strong> {groups.join(", ")}
              </div>
            )}
          </>
        ) : (
          "N/A"
        )}
      </td>

      {/* Contacts Section with Dropdown */}
      <td
        className={`${styles.contacts} ${isContactOpen ? styles.open : ""}`}
        onClick={() => setIsContactOpen(!isContactOpen)}
      >
        {contacts.length > 0 ? (
          <>
            <div className={styles.tooltipContainer}>
              {!isContactOpen && contacts.length > 2
                ? `${contacts.slice(0, 2).join(", ")}...`
                : contacts.join(", ")}
            </div>
            {isContactOpen && (
              <div className={styles.dropdownContent}>
                <strong>Contacts:</strong> {contacts.join(", ")}
              </div>
            )}
          </>
        ) : (
          "N/A"
        )}
      </td>

      <td className={styles.editButton}>
        <button onClick={handleEdit} aria-label="Edit Campaign">
          <FaEdit />
        </button>
      </td>

      <td className={styles.previewLink}>
      <a href={`${baseUrl}/packages/details?id=${campaign.pkgId}&email=${email}`} target="_blank" rel="noopener noreferrer">Preview</a>

      </td>
    </tr>
  );
};

export default CampaignCard;