// src/pages/Customers/Customers.jsx
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import styles from "./styles/Customers.module.scss";
import CustomerCard from "../../components/Cards/CustomerCard";
import { FaSearch, FaArrowLeft, FaTrash } from "react-icons/fa";
import api from "../../utils/api";

const CONTACT_FILTER_OPTIONS = {
  ALL: "All Contacts",
  EXISTING: "Existing Customers Only",
  OUTSIDE: "Outside New Contacts",
};

const ROW_STATUSES = ["ALL", "send", "generate", "sent"];
const CAMPAIGN_TYPE_OPTIONS = ["ALL", "whatsapp", "instagram", "email"];

export default function Customers() {
  const navigate = useNavigate();
  const { campaigns, isLoading, campaignError } = useContext(CampaignContext);
  const { userData } = useContext(AuthContext);

  console.log("Campaigns:", campaigns);

  const [searchQuery, setSearchQuery] = useState("");
  const [contactFilter, setContactFilter] = useState("ALL");
  const [rowStatusFilter, setRowStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loyaltyMode, setLoyaltyMode] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [autoSending, setAutoSending] = useState(false);
  const [autoGenIntervalId, setAutoGenIntervalId] = useState(null);

  const existingCustomerIds =
    userData?.Profile?.customer?.map((c) => c.id) || [];
  const loyaltyGroup = userData?.Profile?.groups?.find(
    (g) => g.name === "Loyalty Group"
  );
  const loyaltyCustomerIds = loyaltyGroup?.contactId || [];

  // Flatten campaigns => array of contact rows
  const campaignContacts = campaigns.flatMap((campaign) => {
    const {
      interestContacts = [],
      name: campaignName,
      pkgId,
      id,
      type,
    } = campaign;
    if (!interestContacts.length) return [];
    return interestContacts.map((contactPerson) => ({
      campaignId: id,
      campaignName: campaignName || `Campaign ${id}`,
      campaignType: type || "N/A",
      oldPkgId: pkgId || "",
      newPkgId: contactPerson.newPkgId || "",
      contactId: contactPerson.id,
      contactName: contactPerson.name,
      prompt: contactPerson.prompts || "",
      status: contactPerson.status || "send",
    }));
  });

  // Filter logic
  const getDisplayRows = () => {
    if (loyaltyMode) {
      const loyaltyCustomers =
        userData?.Profile?.customer?.filter((c) =>
          loyaltyCustomerIds.includes(c.id)
        ) || [];
      return loyaltyCustomers.map((cust, index) => ({
        rowId: `loyalty-${cust.id}`,
        rowNumber: index + 1,
        campaignName: "Loyalty Customer",
        contactName: cust.name,
        prompt: "",
        oldPkgId: "",
        newPkgId: "",
        status: "sent",
      }));
    }

    let filteredRows = campaignContacts;
    if (searchQuery.trim()) {
      filteredRows = filteredRows.filter((row) =>
        row.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (contactFilter === "EXISTING") {
      filteredRows = filteredRows.filter((r) =>
        existingCustomerIds.includes(r.contactId)
      );
    } else if (contactFilter === "OUTSIDE") {
      filteredRows = filteredRows.filter(
        (r) => !existingCustomerIds.includes(r.contactId)
      );
    }
    if (rowStatusFilter !== "ALL") {
      filteredRows = filteredRows.filter((r) => r.status === rowStatusFilter);
    }
    if (typeFilter !== "ALL") {
      filteredRows = filteredRows.filter(
        (r) => r.campaignType.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    return filteredRows.map((r, i) => ({
      ...r,
      rowNumber: i + 1,
      rowId: `${r.campaignId}-${r.contactId}`,
    }));
  };

  const displayRows = getDisplayRows();

  // Handlers
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleContactFilterChange = (e) => setContactFilter(e.target.value);
  const handleStatusFilterChange = (e) => setRowStatusFilter(e.target.value);
  const handleTypeFilterChange = (e) => setTypeFilter(e.target.value);

  const toggleLoyaltyMode = () => {
    setLoyaltyMode((prev) => !prev);
    setSearchQuery("");
    setSelectedRows([]);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    const allIds = displayRows.map((r) => r.rowId);
    if (selectedRows.length === allIds.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIds);
    }
  };

  const handleDeleteSelected = async () => {
    console.log("Deleting selected =>", selectedRows);
    setSelectedRows([]);
  };

  // Auto-generate logic
  const autoGeneratePackages = useCallback(async () => {
    const generateRows = displayRows.filter(
      (row) => row.status === "generate" && row.newPkgId === ""
    );
    generateRows.forEach(async (row) => {
      try {
        const payload = {
          oldPkgId: row.oldPkgId,
          prompt: row.prompt,
        };
        const res = await api.post("/api/ai/packages/customize", payload);
        const { newPkgJson } = res.data;
        console.log("Auto gen for row =>", row.rowId, newPkgJson);
        // In real usage, you'd update local or global state with newPkgJson.id
      } catch (err) {
        console.error("Auto generate error =>", err);
      }
    });
  }, [displayRows]);

  useEffect(() => {
    if (autoSending && !autoGenIntervalId) {
      // Example: run this check every 1 minute (60000), or 1 hour (3600000) in production
      const intervalId = setInterval(() => {
        console.log("auto gen triggered");
        autoGeneratePackages();
      }, 60000);
      setAutoGenIntervalId(intervalId);
    } else if (!autoSending && autoGenIntervalId) {
      clearInterval(autoGenIntervalId);
      setAutoGenIntervalId(null);
    }
    return () => {
      if (autoGenIntervalId) clearInterval(autoGenIntervalId);
    };
  }, [autoSending, autoGenIntervalId, autoGeneratePackages]);

  return (
    <div className={styles.customersContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          {loyaltyMode ? "Loyalty Customers" : "Interested Campaign Contacts"}
          <p className={styles.subtitle}>
            {loyaltyMode
              ? " Top loyalty customers who have shown interest in your campaigns."
              : "View and manage contacts who have shown interest in your campaigns."}
          </p>
        </h2>

        <button
          className={`${styles.loyaltyToggleBtn} ${styles.actionBtn}`}
          onClick={toggleLoyaltyMode}
        >
          {loyaltyMode ? "Go Back" : "Show Loyalty Customers"}
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder={
              loyaltyMode
                ? "Search Loyalty Customers..."
                : "Search by Campaign Name..."
            }
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        {!loyaltyMode && (
          <div className={styles.filters}>
            <div className={styles.filterSection}>
              <label htmlFor="typeFilter">Filter by Type:</label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className={styles.contactFilterSelect}
                aria-label="Filter campaigns by type"
              >
                {CAMPAIGN_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterSection}>
              <label>Contact Filter:</label>
              <select
                value={contactFilter}
                onChange={handleContactFilterChange}
                className={styles.contactFilterSelect}
              >
                {Object.entries(CONTACT_FILTER_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterSection}>
              <label>Package Status:</label>
              <select
                value={rowStatusFilter}
                onChange={handleStatusFilterChange}
                className={styles.contactFilterSelect}
              >
                {ROW_STATUSES.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.autoSendToggle}>
              <label htmlFor="autoSendingSwitch">Auto Send?</label>
              <input
                type="checkbox"
                id="autoSendingSwitch"
                checked={autoSending}
                onChange={() => setAutoSending((prev) => !prev)}
              />
            </div>
          </div>
        )}

        {selectedRows.length > 0 && (
          <button
            className={`${styles.deleteButton} ${styles.actionBtn}`}
            onClick={handleDeleteSelected}
            aria-label="Delete selected rows"
          >
            <FaTrash /> Delete
          </button>
        )}
      </div>

      {isLoading ? (
        <p className={styles.loadingMsg}>Loading...</p>
      ) : campaignError ? (
        <p className={styles.errorMsg}>Error: {campaignError}</p>
      ) : displayRows.length === 0 ? (
        <p className={styles.noDataMsg}>No matching data found.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCol}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      displayRows.length > 0 &&
                      selectedRows.length === displayRows.length
                    }
                  />
                </th>
                <th className={styles.numberCol}>#</th>
                <th className={styles.campaignCol}>Campaign Name</th>
                <th className={styles.typeCol}>Type</th>
                <th className={styles.contactCol}>Contact</th>
                <th className={styles.promptCol}>Prompt</th>
                <th className={styles.oldPreviewCol}>Old Preview</th>
                <th className={styles.newPreviewCol}>New Preview</th>
                <th className={styles.sendCol}>Send</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => {
                const isSelected = selectedRows.includes(row.rowId);
                return (
                  <CustomerCard
                    key={row.rowId}
                    row={row}
                    isSelected={isSelected}
                    onSelectRow={handleSelectRow}
                    autoSending={autoSending}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
