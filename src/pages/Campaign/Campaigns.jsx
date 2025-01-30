import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";

import { FaSearch, FaRegBookmark, FaTrash } from "react-icons/fa";

import CampaignCard from "../../components/Cards/CampaignCard";

import styles from "./styles/Campaigns.module.scss";

const STATUS_OPTIONS = ["ALL", "Running", "Hold", "Stopped"];
const STATUS_CHANGE_OPTIONS = ["Run", "Stop", "Hold"];

const Campaigns = () => {
  const navigate = useNavigate();
  const {
    campaigns,
    deleteCampaigns,
    isLoading,
    campaignError,
    fetchPackageDetails,
    updateCampaignStatus,
  } = useContext(CampaignContext);
  const { userData } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [statusChangeError, setStatusChangeError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [packagesMap, setPackagesMap] = useState({});


  useEffect(() => {
    const loadPackageTitles = async () => {
      const fetchedPackages = await fetchPackageDetails();
      setPackagesMap(fetchedPackages);
    };

    if (campaigns.length > 0) {
      loadPackageTitles();
    }
  }, [campaigns, fetchPackageDetails]);

  const getGroupNames = (grpIds) => {
    if (!userData?.Profile?.groups) return [];
    return userData.Profile.groups
      .filter((group) => grpIds.includes(group.id))
      .map((group) => group.name);
  };

  const getContactNames = (contactIds) => {
    if (!userData?.Profile?.customer) return [];
    return userData.Profile.customer
      .filter((contact) => contactIds.includes(contact.id))
      .map((contact) => contact.name);
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredCampaigns.map((campaign) => campaign.id);
    if (selectedCampaigns.length === allIds.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(allIds);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const [campaignFilter, setCampaignFilter] = useState("ALL");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const campaignName = campaign.name || `Campaign ${campaign.id}`;
    const packageTitle = packagesMap[campaign.pkgId] || "";
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      campaignName.toLowerCase().includes(searchLower) ||
      packageTitle.toLowerCase().includes(searchLower) ||
      (campaign.location && campaign.location.toLowerCase().includes(searchLower));

    const matchesStatus =
      campaignFilter === "ALL" || campaign.status === campaignFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSavedRoute = () => {
    navigate("/packages/saved");
  };

  const handleDeleteCampaigns = async () => {
    setDeleteError("");
    try {
      // API call to delete campaigns
      await axios.post("/api/campaigns/delete", { campaignIds: selectedCampaigns });
      await deleteCampaigns(selectedCampaigns); // Update local state
      setSelectedCampaigns([]);
    } catch (error) {
      setDeleteError("Failed to delete selected campaigns. Please try again.");
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handleStatusChange = async () => {
    setStatusChangeError("");
    try {
      // API call to update campaign status
      await axios.post("/api/campaigns/update-status", {
        campaignIds: selectedCampaigns,
        newStatus: newStatus,
      });
      await updateCampaignStatus(selectedCampaigns, newStatus); // Update local state
      setSelectedCampaigns([]);
      setNewStatus("");
    } catch (error) {
      setStatusChangeError("Failed to update campaign status. Please try again.");
    } finally {
      setIsStatusModalOpen(false);
    }
  };

  return (
    <div className={styles.campaignsContainer}>
      <div className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.headingArea}>
            <h1 className={styles.mainTitle}>Your Campaigns</h1>
            <p className={styles.subtitle}>
              Manage your travel campaigns effectively
            </p>
          </div>
          <div className={styles.filterBar}>
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className={styles.statusFilter}
              aria-label="Filter campaigns by status"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Campaigns"
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
            aria-label="Search Campaigns"
          />
        </div>

        {selectedCampaigns.length > 0 && (
          <div className={styles.bulkActions}>
            <select
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                setIsStatusModalOpen(true);
              }}
              className={styles.statusChangeDropdown}
              aria-label="Change campaign status"
            >
              <option value="">Change Status</option>
              {STATUS_CHANGE_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              className={styles.deleteButton}
              onClick={() => setIsConfirmModalOpen(true)}
              aria-label="Delete selected campaigns"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      <table className={styles.campaignTable}>
        <thead>
          <tr>
            <th className={styles.checkbox}>
              <input
                type="checkbox"
                checked={
                  filteredCampaigns.length > 0 &&
                  selectedCampaigns.length === filteredCampaigns.length
                }
                onChange={handleSelectAll}
                aria-label="Select all campaigns"
              />
            </th>
            <th className={styles.number}>#</th>
            <th className={styles.campaignName}>Campaign</th>
            <th className={styles.status}>Status</th>
            <th className={styles.packageName}>Package</th>
            <th className={styles.groups}>Groups</th>
            <th className={styles.contacts}>Contacts</th>
            <th className={styles.editButton}>Edit</th>
            <th className={styles.previewLink}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className={styles.loading}>
                Loading campaigns...
              </td>
            </tr>
          ) : filteredCampaigns.length === 0 ? (
            <tr>
              <td colSpan="9" className={styles.noCampaigns}>
                No campaigns found.
              </td>
            </tr>
          ) : (
            filteredCampaigns.map((campaign, index) => {
              const groups = getGroupNames(campaign.grpId);
              const contacts = getContactNames(campaign.contactId);
              const packageTitle = packagesMap[campaign.pkgId] || "N/A";

              return (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  index={index}
                  isSelected={selectedCampaigns.includes(campaign.id)}
                  onSelect={handleSelectCampaign}
                  groups={groups}
                  contacts={contacts}
                  packageTitle={packageTitle}
                />
              );
            })
          )}
        </tbody>
      </table>

      {isConfirmModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the selected campaigns?</p>
            {deleteError && <div className={styles.errorText}>{deleteError}</div>}
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteCampaigns}
              >
                Yes, Delete
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isStatusModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Status Change</h2>
            <p>Are you sure you want to change the status of the selected campaigns to {newStatus}?</p>
            {statusChangeError && <div className={styles.errorText}>{statusChangeError}</div>}
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleStatusChange}
              >
                Yes, Change Status
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;