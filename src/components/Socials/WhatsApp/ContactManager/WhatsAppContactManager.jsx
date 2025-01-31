// src/components/WhatsAppModal/WhatsAppContactManager.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import api from "../../../../utils/api";
import { FiArrowLeft } from "react-icons/fi"; // Importing the left arrow icon
import styles from "./styles/WhatsAppContactManager.module.scss";
import SelectGroups from "./Groups/SelectGroups";
import CreateEditGroup from "./Groups/CreateEditGroups.jsx";
import SendToIndividualContacts from "./Groups/IndividualContacts.jsx";
import { validatePhoneNumber } from "../../../../utils/ContactValidation.js";

const WhatsAppContactManager = ({
  message,
  campaignName,
  title,
  image,
  packageId,
  description,
  scheduleDay,
  scheduleTime,
  onBack,
  onClose,
}) => {
  const { userData, updateUserData } = useContext(AuthContext);
  const existingContacts = userData?.Profile?.customer || [];
  const existingGroups =
    userData?.Profile?.groups?.filter(
      (group) => group.type.toLowerCase() === "whatsapp"
    ) || [];

  console.log("Existing Contacts:", existingContacts);
  console.log("Existing Groups:", existingGroups);

  // State Variables
  const [selectedGroups, setSelectedGroups] = useState([]); // Array of group IDs to send to
  const [groupToEdit, setGroupToEdit] = useState(null); // Group object being edited
  const [groupName, setGroupName] = useState(""); // Group name (for create/edit)
  const [groupContacts, setGroupContacts] = useState([]); // Array of contact IDs in the group being created/edited
  const [selectedIndividualContacts, setSelectedIndividualContacts] = useState(
    []
  ); // Array of individual contact IDs to send to
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [individualContactsSearch, setIndividualContactsSearch] = useState(""); // Search term for individual contacts

  // Handle selecting/deselecting groups for sending
  const handleGroupSelection = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  // Handle selecting a group for editing
  const handleEditGroup = (group) => {
    setGroupToEdit(group);
    setGroupName(group.name);
    setGroupContacts(group.contactId);
  };

  // Handle cancel editing a group
  const handleCancelEdit = () => {
    setGroupToEdit(null);
    setGroupName("");
    setGroupContacts([]);
    setErrors({});
  };

  // Handle toggling contacts in the create/edit group section
  const handleGroupContactToggle = (contactId) => {
    if (groupContacts.includes(contactId)) {
      setGroupContacts(groupContacts.filter((id) => id !== contactId));
    } else {
      setGroupContacts([...groupContacts, contactId]);
    }
  };

  // Handle creating a new group
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setErrors({ ...errors, groupName: "Group name is required." });
      return;
    }
    if (groupContacts.length < 2) {
      setErrors({
        ...errors,
        groupContacts: "At least two contacts are required to create a group.",
      });
      return;
    }

    // Ensure contacts are valid
    const validContactIds = groupContacts.filter((id) => getPhoneById(id));

    if (validContactIds.length < 2) {
      setErrors({
        ...errors,
        groupContacts: "Selected contacts are invalid.",
      });
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      contactId: validContactIds,
      type: "whatsapp",
      agentId: userData.id, // Assuming userData has an id
    };

    // Update groups in context
    const updatedGroups = [...existingGroups, newGroup];
    const updatedUserData = {
      ...userData,
      Profile: {
        ...userData.Profile,
        groups: updatedGroups,
      },
    };

    setIsCreatingGroup(true);
    setIsUpdating(true);
    api
      .post("/api/user/update", updatedUserData)
      .then((response) => {
        updateUserData(updatedUserData);
        setSelectedGroups([...selectedGroups, newGroup.id]); // Optionally select the new group
        setGroupName("");
        setGroupContacts([]);
        setErrors({ ...errors, groupName: null, groupContacts: null });
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        alert("Failed to create group. Please try again.");
      })
      .finally(() => {
        setIsCreatingGroup(false);
        setIsUpdating(false);
      });
  };

  // Handle updating an existing group
  const handleUpdateGroup = () => {
    if (!groupName.trim()) {
      setErrors({ ...errors, groupName: "Group name is required." });
      return;
    }
    if (groupContacts.length < 2) {
      setErrors({
        ...errors,
        groupContacts: "At least two contacts are required in the group.",
      });
      return;
    }

    // Ensure contacts are valid
    const validContactIds = groupContacts.filter((id) => getPhoneById(id));

    if (validContactIds.length < 2) {
      setErrors({
        ...errors,
        groupContacts: "Selected contacts are invalid.",
      });
      return;
    }

    const updatedGroup = {
      ...groupToEdit,
      name: groupName.trim(),
      contactId: validContactIds,
    };

    // Update groups in context
    const updatedGroups = existingGroups.map((group) =>
      group.id === updatedGroup.id ? updatedGroup : group
    );
    const updatedUserData = {
      ...userData,
      Profile: {
        ...userData.Profile,
        groups: updatedGroups,
      },
    };

    setIsUpdating(true);
    api
      .post("/api/user/update", updatedUserData)
      .then((response) => {
        updateUserData(updatedUserData);
        setGroupToEdit(updatedGroup);
        setGroupName("");
        setGroupContacts([]);
        setErrors({ ...errors, groupName: null, groupContacts: null });
      })
      .catch((error) => {
        console.error("Error updating group:", error);
        alert("Failed to update group. Please try again.");
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  // Helper function to get phone by contact ID
  const getPhoneById = (id) => {
    const contact = existingContacts.find((contact) => contact.id === id);
    return contact ? contact.whatsApp : "";
  };

  // Handle selecting/deselecting individual contacts for sending
  const handleIndividualContactSelection = (contactId) => {
    if (selectedIndividualContacts.includes(contactId)) {
      setSelectedIndividualContacts(
        selectedIndividualContacts.filter((id) => id !== contactId)
      );
    } else {
      setSelectedIndividualContacts([...selectedIndividualContacts, contactId]);
    }
  };

  // Handle sending WhatsApp message
  const sendWhatsAppMessage = async () => {
    setIsSending(true);
  
    const formData = new FormData();
    formData.append("packageId", packageId);
    formData.append("campaignName", campaignName);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("scheduleDay", scheduleDay);
    formData.append("scheduleTime", scheduleTime);
    formData.append("message", message);
    formData.append("groupIds", JSON.stringify(selectedGroups)); // Convert array to JSON string
    formData.append("contactIds", JSON.stringify(selectedIndividualContacts)); // Convert array to JSON string
  
    // Image Handling: If a new file is selected, send the file. Otherwise, send the URL.
    if (image.file) {
      formData.append("image", image.file); // Send the binary file
    } else if (image.preview) {
      formData.append("imageUrl", image.preview); // Send the existing preview URL
    }
  
    console.log("Sending WhatsApp Data:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await api.post("/api/whatsapp/send", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type
      });
  
      console.log("WhatsApp API Response:", response.data);
      alert("WhatsApp message sent successfully!");
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert("Failed to send WhatsApp message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  

  // Determine if send button should be enabled
  const isSendEnabled =
    (selectedGroups.length > 0 || selectedIndividualContacts.length > 0) &&
    !isCreatingGroup &&
    !isUpdating &&
    !isSending;

  return (
    <div className={styles.managerContainer}>
      {/* Header with Back Button */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
          aria-label="Go Back"
        >
          <FiArrowLeft size={20} /> 
          Back
        </button>
        <h2 className={styles.title}>Contacts Details</h2>
      </div>

      {/* Horizontal Container for Select Groups and Create/Edit Group */}
      <div className={styles.horizontalContainer}>
        {/* Select Groups Section */}
        <SelectGroups
          existingGroups={existingGroups}
          selectedGroups={selectedGroups}
          handleGroupSelection={handleGroupSelection}
          handleEditGroup={handleEditGroup}
        />

        {/* Create New Group / Group Details Section */}
        <CreateEditGroup
          groupToEdit={groupToEdit}
          groupName={groupName}
          setGroupName={setGroupName}
          groupContacts={groupContacts}
          setGroupContacts={setGroupContacts}
          existingContacts={existingContacts}
          handleGroupContactToggle={handleGroupContactToggle}
          handleCreateGroup={handleCreateGroup}
          handleUpdateGroup={handleUpdateGroup}
          handleCancelEdit={handleCancelEdit}
          errors={errors}
          isUpdating={isUpdating}
          isCreatingGroup={isCreatingGroup}
        />
      </div>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Bottom Sections: Send to Individual Contacts */}
      <div className={styles.bottomSections}>
        {/* Send to Individual Contacts */}
        <SendToIndividualContacts
          individualContactsSearch={individualContactsSearch}
          setIndividualContactsSearch={setIndividualContactsSearch}
          selectedIndividualContacts={selectedIndividualContacts}
          handleIndividualContactSelection={handleIndividualContactSelection}
          existingContacts={existingContacts}
          errors={errors}
        />
      </div>

      {/* Send WhatsApp Message Button */}
      <button
        className={styles.sendButton}
        onClick={sendWhatsAppMessage}
        disabled={!isSendEnabled}
        aria-label="Send WhatsApp Message"
      >
        {isSending ? "Sending..." : "Send WhatsApp Message"}
      </button>
    </div>
  );
};

export default WhatsAppContactManager;
