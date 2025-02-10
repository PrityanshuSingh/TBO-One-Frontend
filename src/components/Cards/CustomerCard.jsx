// src/components/Cards/CustomerCard.jsx

import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/CustomerCard.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { FaEdit } from "react-icons/fa";
import api from "../../utils/api";

// Example fallback old package JSON
const fallbackOldPkg = {
  id: "000",
  packageTitle: "Fallback Package",
  image: "data:image/png;base64,fallback",
  location: "Unknown",
  duration: "N/A",
  shortDescription: "Fallback short description.",
  detailedDescription: "Fallback detailed description.",
  price: {
    currency: "INR",
    basePrice: 0,
    taxes: 0,
    discount: 0,
    totalPrice: 0,
  },
};

const CustomerCard = ({ row, isSelected, onSelectRow, autoSending }) => {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("CustomerCard row:", row);

  const email = userData?.Profile?.email;
  const baseUrl = window.location.origin;
  const travelerMobile = userData?.Profile?.contactNumber || "";
  const travelerEmail = userData?.Profile?.email || "";

  // localStatus can be "generate", "send", or "sent"
  const [localStatus, setLocalStatus] = useState(row.status);
  const [newPkg, setNewPkg] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Select row checkbox
  const handleSelect = () => {
    onSelectRow(row.rowId);
  };

  // Generate function: fetch old package data and generate new package using provided prompt and oldPkgId
  const handleGenerate = async (prompt, oldPkgId) => {
    try {
      let oldPkgData = null;

      if (!oldPkgId) {
        console.warn("No oldPkgId found, using fallback data.");
        oldPkgData = fallbackOldPkg;
      } else {
        try {
          const fetchRes = await api.get(`/api/packages?id=${oldPkgId}`);
          oldPkgData = fetchRes.data;
        } catch (fetchErr) {
          console.error("Failed to fetch old package. Using fallback.", fetchErr);
          oldPkgData = fallbackOldPkg;
        }
      }

      const generatePayload = {
        oldPkg: oldPkgData,
        prompt: prompt,
      };

      const genRes = await api.post("/api/ai/packages/customize", generatePayload);
      const newPackage = genRes.data;
      if (!newPackage) {
        console.warn("Backend did not return new package data. Setting to 'NA'.");
        setNewPkg("NA");
      } else {
        setNewPkg(newPackage);
      }

      // Once newPkg is received, update status to "send"
      setLocalStatus("send");
    } catch (err) {
      console.error("Generate package failed =>", err);
    }
  };

  // Auto-generate: if autoSending is true and the row is in "generate" stage and no newPkg is present, trigger generation automatically.
  useEffect(() => {
    if (autoSending && localStatus === "generate" && !newPkg) {
      handleGenerate(row.prompt, row.oldPkgId);
    }
    // Dependencies include autoSending, localStatus, newPkg, row.prompt, row.oldPkgId.
  }, [autoSending, localStatus, newPkg, row.prompt, row.oldPkgId]);

  const previewMessage = useMemo(() => {
    return `Check out this new package freshly crafted according to your needs: ${newPkg?.packageTitle}
Location: ${newPkg?.location || ""}
Price: ${newPkg?.currency || ""} ${newPkg?.price || ""}
Duration: ${newPkg?.duration || ""}
Description: ${newPkg?.detailedDescription}
Details: "View Details link"
Travelers: ${travelerMobile}, ${travelerEmail}`;
  }, [
    newPkg?.packageTitle,
    newPkg?.location,
    newPkg?.price,
    newPkg?.currency,
    newPkg?.detailedDescription,
    newPkg?.id,
    travelerMobile,
    travelerEmail,
  ]);

  const DetailsUrl = useMemo(() => {
    return `https://tbo-one.vercel.app/packages/details?cid=${row.campaignId}`;
  }, [newPkg?.id, travelerEmail]);

  // Send function: only send if newPkg exists
  const handleSend = async () => {
    if (!newPkg) {
      console.warn("No new package found. Cannot send.");
      return;
    }
    setIsSending(true);
    const formData = new FormData();
    formData.append("campaignId", row.campaignId || "Unknown Campaign ID");
    formData.append("packageId", newPkg?.id);
    formData.append("campaignName", row.campaignName || "Unknown Campaign");
    formData.append("campaignType", row.campaignType || "WhatsApp");
    formData.append("email", travelerEmail);
    formData.append("title", newPkg?.packageTitle);
    formData.append("description", newPkg?.detailedDescription);
    formData.append("scheduleDateTime", "");
    formData.append("frequency", "");
    formData.append("campaignEnd", "");
    formData.append("message", previewMessage);
    formData.append("DetailsUrl", DetailsUrl);
    formData.append("Travelers", `${travelerMobile}, ${travelerEmail}`);
    formData.append("groupIds", JSON.stringify([]));
    formData.append("contactIds", JSON.stringify([row.contactId]));
    formData.append("imageUrl", newPkg?.image || "");

    try {
      const response = await api.post("/api/whatsapp/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("WhatsApp API Response:", response.data);
      alert("WhatsApp message sent successfully!");
      // Optionally, close modal or perform further actions here.
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert("Failed to send WhatsApp message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Edit function: navigate to package details page for editing
  const handleEditNewPkg = () => {
    if (!newPkg?.id) return;
    navigate(`/u/packages/details/${newPkg.id}`);
  };

  // Determine current stage for row actions
  const isGenerateStage = localStatus === "generate";
  const isSendStage = localStatus === "send";
  const isSentStage = localStatus === "sent";
  const showNewPreview = isSendStage || isSentStage;

  return (
    <tr className={styles.campaignRow}>
      {/* SELECT CHECKBOX */}
      <td className={styles.checkboxCol}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          aria-label={`Select row ${row.rowNumber}`}
        />
      </td>

      {/* ROW NUMBER, CAMPAIGN NAME, CONTACT */}
      <td>{row.rowNumber}</td>
      <td className={styles.campaignNameCol}>{row.campaignName}</td>
      <td>{row.campaignType}</td>
      <td>{row.contactName}</td>

      {/* PROMPT with native browser tooltip for full text */}
      <td className={styles.promptCol}>
        <span className={styles.promptText} title={row.prompt}>
          {row.prompt.length > 30 ? row.prompt.substring(0, 40) + "..." : row.prompt}
        </span>
      </td>

      {/* OLD PACKAGE PREVIEW */}
      <td>
        {row.oldPkgId ? (
          <a
            href={`${baseUrl}/packages/details?cid=${row.campaignId}`}
            target="_blank"
            rel="noreferrer"
            className={styles.oldPkgLink}
          >
            Old Pkg
          </a>
        ) : (
          "-"
        )}
      </td>

      {/* NEW PACKAGE PREVIEW & EDIT */}
      <td>
        {showNewPreview ? (
          <div className={styles.newPkgActions}>
            <a
              href={`${baseUrl}/packages/details?pid=${newPkg?.id}`}
              target="_blank"
              rel="noreferrer"
              className={styles.newPkgBtn}
            >
              New Pkg
            </a>
            <button
              onClick={handleEditNewPkg}
              className={styles.editButton}
              title="Edit newly generated package"
            >
              <FaEdit />
            </button>
          </div>
        ) : (
          <div className={styles.unknownStatus}>N/A</div>
        )}
      </td>

      {/* ACTION COLUMN: Generate or Send or Show Sent */}
      <td className={styles.actionCol}>
        {isGenerateStage && (
          <button
            className={styles.generateBtn}
            onClick={() => handleGenerate(row.prompt, row.oldPkgId)}
          >
            {autoSending ? "Auto-Generate" : "Generate"}
          </button>
        )}
        {isSendStage && (
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? "Sending..." : autoSending ? "Auto" : "Send"}
          </button>
        )}
        {isSentStage && <span className={styles.sentTag}>Sent</span>}
        {!isGenerateStage && !isSendStage && !isSentStage && (
          <span className={styles.unknownStatus}>{localStatus}</span>
        )}
      </td>
    </tr>
  );
};

export default CustomerCard;
