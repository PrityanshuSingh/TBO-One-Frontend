// src/components/WhatsAppModal/WhatsAppContactManager.jsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import axios from 'axios';
import styles from './styles/WhatsAppContactManager.module.scss';
import SelectGroups from './Groups/SelectGroups';
import CreateEditGroup from './Groups/CreateEditGroups.jsx';
import SendToIndividualContacts from './Groups/IndividualContacts.jsx';
import { validatePhoneNumber } from '../../../../utils/ContactValidation.js';

const WhatsAppContactManager = ({
  message,
  title,
  image, // Expecting { file: File | null, preview: string }
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
      (group) => group.type.toLowerCase() === 'whatsapp'
    ) || [];

  console.log('Existing Contacts:', existingContacts);
  console.log('Existing Groups:', existingGroups);

  // State Variables
  const [selectedGroups, setSelectedGroups] = useState([]); // Array of group IDs to send to
  const [groupToEdit, setGroupToEdit] = useState(null); // Group object being edited
  const [groupName, setGroupName] = useState(''); // Group name (for create/edit)
  const [groupContacts, setGroupContacts] = useState([]); // Array of contact IDs in the group being created/edited
  const [selectedIndividualContacts, setSelectedIndividualContacts] = useState([]); // Array of individual contact IDs to send to
  const [isSending, setIsSending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [individualContactsSearch, setIndividualContactsSearch] = useState(''); // Search term for individual contacts

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
    setGroupName('');
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
      setErrors({ ...errors, groupName: 'Group name is required.' });
      return;
    }
    if (groupContacts.length < 2) {
      setErrors({
        ...errors,
        groupContacts: 'At least two contacts are required to create a group.',
      });
      return;
    }

    // Ensure contacts are valid
    const validContactIds = groupContacts.filter((id) => getPhoneById(id));

    if (validContactIds.length < 2) {
      setErrors({
        ...errors,
        groupContacts: 'Selected contacts are invalid.',
      });
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      contactId: validContactIds,
      type: 'whatsapp',
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
    axios
      .post('/api/user/update', updatedUserData)
      .then((response) => {
        updateUserData(updatedUserData);
        setSelectedGroups([...selectedGroups, newGroup.id]); // Optionally select the new group
        setGroupName('');
        setGroupContacts([]);
        setErrors({ ...errors, groupName: null, groupContacts: null });
      })
      .catch((error) => {
        console.error('Error creating group:', error);
        alert('Failed to create group. Please try again.');
      })
      .finally(() => {
        setIsCreatingGroup(false);
        setIsUpdating(false);
      });
  };

  // Handle updating an existing group
  const handleUpdateGroup = () => {
    if (!groupName.trim()) {
      setErrors({ ...errors, groupName: 'Group name is required.' });
      return;
    }
    if (groupContacts.length < 2) {
      setErrors({
        ...errors,
        groupContacts: 'At least two contacts are required in the group.',
      });
      return;
    }

    // Ensure contacts are valid
    const validContactIds = groupContacts.filter((id) => getPhoneById(id));

    if (validContactIds.length < 2) {
      setErrors({
        ...errors,
        groupContacts: 'Selected contacts are invalid.',
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
    axios
      .post('/api/user/update', updatedUserData)
      .then((response) => {
        updateUserData(updatedUserData);
        setGroupToEdit(updatedGroup);
        setGroupName('');
        setGroupContacts([]);
        setErrors({ ...errors, groupName: null, groupContacts: null });
      })
      .catch((error) => {
        console.error('Error updating group:', error);
        alert('Failed to update group. Please try again.');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  // Helper function to get phone by contact ID
  const getPhoneById = (id) => {
    const contact = existingContacts.find((contact) => contact.id === id);
    return contact ? contact.whatsApp : '';
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

  // Helper function to convert image URL to File
  const convertImageUrlToFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error('Error converting image URL to File:', error);
      throw error;
    }
  };

  // Handle sending WhatsApp message
  const sendWhatsAppMessage = async () => {
    setIsSending(true);

    try {
      let imageFile = null;

      // If image.file exists, use it
      if (image.file) {
        imageFile = image.file;
      } else if (image.preview && image.preview.startsWith('http')) {
        // If only image URL exists, fetch and convert to File
        imageFile = await convertImageUrlToFile(image.preview);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('packageId', packageId);
      formData.append('title', title);
      if (imageFile) {
        formData.append('image', imageFile); // Append the image file
      }
      formData.append('description', description);
      formData.append('scheduleDay', scheduleDay);
      formData.append('scheduleTime', scheduleTime);
      formData.append('message', message);
      formData.append('groupIds', JSON.stringify(selectedGroups)); // Assuming backend expects JSON strings for arrays
      formData.append('contactIds', JSON.stringify(selectedIndividualContacts));

      console.log('Sending WhatsApp Data:', {
        packageId,
        title,
        imageFile,
        description,
        scheduleDay,
        scheduleTime,
        message,
        groupIds: selectedGroups,
        contactIds: selectedIndividualContacts,
      });

      const response = await axios.post('/api/whatsapp/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('WhatsApp API Response:', response.data);
      alert('WhatsApp message sent successfully!');
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      alert('Failed to send WhatsApp message. Please try again.');
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
          ← Back
        </button>
        <h2 className={styles.title}>Select Contacts</h2>
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
        {isSending ? 'Sending...' : 'Send WhatsApp Message'}
      </button>
    </div>
  );
};

export default WhatsAppContactManager;
