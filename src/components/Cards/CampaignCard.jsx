import React, { useState, useContext } from "react";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./styles/CampaignCard.module.scss";
import api from "../../utils/api";
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
  const email = userData?.Profile?.email;
  const baseUrl = window.location.origin;

  // Standardize package ID property (pkgId or pkgid)
  const pkgId = campaign.pkgId || campaign.pkgid;

  const handleEdit = () => {
    // Early check to ensure pkgId is defined
    if (!pkgId) {
      console.error("Package ID is missing in campaign data:", campaign);
      return;
    }

    console.log("Edit button clicked for campaign:", campaign);

    if (campaign.type === "whatsapp") {
      navigate(`/u/packages/whatsAppCampaign/${pkgId}`);
    } else if (campaign.type === "email") {
      navigate(`/u/packages/emailCampaign/${pkgId}`);
    } else if (campaign.type === "instagram") {
      // Fetch package data for Instagram campaign
      const fetchPackageData = async () => {
        try {
          const res = await api.get(`/api/packages?id=${pkgId}`);
          const image = res.data.image;
          const shortDescription = res.data.shortDescription;
          const fetchedTitle = res.data.title;

          navigate(`/u/packages/instagramCampaign/${pkgId}`, {
            state: {
              packageId: pkgId,
              packageImage: image,
              packageTitle: fetchedTitle,
              packagecaption: shortDescription,
            },
          });
        } catch (error) {
          console.error("Failed to fetch package data for campaign:", error);
          // Optionally, show an error notification to the user here.
        }
      };
      fetchPackageData();
    } else {
      console.warn("Unsupported campaign type:", campaign.type);
    }
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
      <td className={styles.campaignName}>
        {campaign.name || `Campaign ${campaign.id}`}
      </td>
      <td className={styles.type}>{campaign.type}</td>
      <td
        className={`${styles.status} ${styles[campaign.status?.toLowerCase()]}`}
      >
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
                ? `${contacts.slice(0, 1).join(", ")}...`
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

      {/* Edit Button */}
      <td className={styles.editButton}>
        <button type="button" onClick={handleEdit} aria-label="Edit Campaign">
          <FaEdit />
        </button>
      </td>

      {/* Preview Link */}
      <td className={styles.previewLink}>
        <a
          href={`${baseUrl}/packages/details?id=${pkgId}&email=${email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Preview
        </a>
      </td>
    </tr>
  );
};

export default CampaignCard;
