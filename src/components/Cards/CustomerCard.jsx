// src/components/Cards/CustomerCard.jsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/CustomerCard.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
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

  const email = userData?.Profile?.email;
  const baseUrl = window.location.origin;

  // Local state for row status & newly generated package ID
  const [localStatus, setLocalStatus] = useState(row.status);
  const [localNewPkgId, setLocalNewPkgId] = useState(row.newPkgId);
  const [isSending, setIsSending] = useState(false);

  // Select row checkbox
  const handleSelect = () => {
    onSelectRow(row.rowId);
  };

  // 1. GENERATE – Get old package data by oldPkgId
  const handleGenerate = async () => {
    try {
      // Step A: fetch entire old package JSON by oldPkgId
      const oldPkgId = row.oldPkgId;
      let oldPkgData = null;

      if (!oldPkgId) {
        // If no oldPkgId, use fallback
        console.warn("No oldPkgId found, using fallback data.");
        oldPkgData = fallbackOldPkg;
      } else {
        try {
          const fetchRes = await axios.get(`/api/packages/${oldPkgId}`);
          oldPkgData = fetchRes.data;
        } catch (fetchErr) {
          console.error("Failed to fetch old package. Using fallback.", fetchErr);
          oldPkgData = fallbackOldPkg;
        }
      }

      // Step B: Send old package data + prompt to /api/packageGenerate
      const generatePayload = {
        oldPkg: oldPkgData,
        prompt: row.prompt,
      };
      const genRes = await axios.post("/api/ai/packages/customize", generatePayload);
      // Suppose this returns { newPkgId: "someGeneratedId" }
      const { newPkgId } = genRes.data;
      if (!newPkgId) {
        console.warn("Backend did not return newPkgId. Setting to 'NA'.");
        setLocalNewPkgId("NA");
      } else {
        setLocalNewPkgId(newPkgId);
      }

      // Step C: switch local status => "send"
      setLocalStatus("send");
    } catch (err) {
      console.error("Generate package failed =>", err);
    }
  };

  // 2. SEND – Build dynamic data from newly generated package & row info
  const handleSend = async () => {
    setIsSending(true);
    try {
      const packageId = localNewPkgId || row.oldPkgId || fallbackOldPkg.id;
      const pkgTitle = row.packageTitle || "User's Newly Generated Package";
      const formData = new FormData();

      formData.append("packageId", packageId);
      formData.append("campaignName", row.campaignName || "Unknown Campaign");
      formData.append("title", pkgTitle);
      formData.append("description", "Short Desc for Sending");
      formData.append("scheduleDay", "");
      formData.append("scheduleTime", "");
      formData.append("message", `Check out this package: ${pkgTitle}`);
      formData.append("Location", row.location || "Unknown");
      formData.append("Price", "INR 37000");
      formData.append("Duration", row.duration || "N/A");
      formData.append("Details", `${baseUrl}/packages/details?id=${packageId}&email=${email}`);
      formData.append("Travelers", `${userData?.Profile?.contactNumber}, ${email}`);
      formData.append("groupIds", JSON.stringify([]));
      formData.append("contactIds", JSON.stringify([row.contactId]));
      formData.append("imageUrl", "data:image/png;base64,sendExample");

      await api.post("/api/whatsapp/send", formData);
      setLocalStatus("sent");
    } catch (err) {
      console.error("Send package failed =>", err);
    } finally {
      setIsSending(false);
    }
  };

  // 3. EDIT – Only if we have localNewPkgId
  const handleEditNewPkg = () => {
    if (!localNewPkgId) return;
    navigate(`/customers/edit/${localNewPkgId}`);
  };

  // Row stage checks
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
      <td>{row.campaignName}</td>
      <td>{row.contactName}</td>

      {/* PROMPT with native browser tooltip for full text */}
      <td className={styles.promptCol}>
        <span className={styles.promptText} title={row.prompt}>
          {row.prompt.length > 20 ? row.prompt.substring(0, 20) + "..." : row.prompt}
        </span>
      </td>

      {/* OLD PACKAGE PREVIEW */}
      <td>
        {row.oldPkgId ? (
          <a
            href={`${baseUrl}/packages/details?id=${row.oldPkgId}&email=${email}`}
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
              href={`${baseUrl}/packages/details?id=${localNewPkgId}&email=${email}`}
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
          "-"
        )}
      </td>

      {/* ACTION COLUMN: Generate or Send or Show Sent */}
      <td>
        {isGenerateStage && (
          <button className={styles.generateBtn} onClick={handleGenerate}>
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
