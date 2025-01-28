// src/components/WhatsAppModal/CreateEditGroup/CreateEditGroup.jsx

import React from 'react';
import styles from './styles/CreateEditGroups.module.scss';

const CreateEditGroup = ({
  groupToEdit,
  groupName,
  setGroupName,
  groupContacts,
  setGroupContacts,
  existingContacts,
  handleGroupContactToggle,
  handleCreateGroup,
  handleUpdateGroup,
  handleCancelEdit,
  errors,
  isUpdating,
  isCreatingGroup,
}) => {
  return (
    <div className={styles.createGroupSection}>
      <h3>{groupToEdit ? 'Group Details' : 'Create New Group'}</h3>
      <div className={styles.createGroupContainer}>
        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={styles.inputField}
          aria-label="Group Name"
        />
        {errors.groupName && <div className={styles.errorText}>{errors.groupName}</div>}

        {/* Contacts List with Checkboxes */}
        <div className={styles.groupContactsList}>
          {existingContacts.length === 0 ? (
            <p>No contacts available.</p>
          ) : (
            existingContacts.map((contact) => (
              <div key={contact.id} className={styles.groupContactItem}>
                <input
                  type="checkbox"
                  checked={groupContacts.includes(contact.id)}
                  onChange={() => handleGroupContactToggle(contact.id)}
                  id={`create-group-contact-${contact.id}`}
                  aria-label={`Select contact ${contact.name}`}
                />
                <label htmlFor={`create-group-contact-${contact.id}`} className={styles.contactLabel}>
                  {contact.name} ({contact.whatsApp})
                </label>
              </div>
            ))
          )}
        </div>
        {errors.groupContacts && <div className={styles.errorText}>{errors.groupContacts}</div>}

        {/* Buttons for Creating or Updating Group */}
        <div className={styles.groupButtons}>
          {groupToEdit ? (
            <>
              <button
                className={styles.updateGroupButton}
                onClick={handleUpdateGroup}
                disabled={isUpdating}
                aria-label="Update Group"
              >
                {isUpdating ? 'Updating...' : 'Update Group'}
              </button>
              <button
                className={styles.cancelEditButton}
                onClick={handleCancelEdit}
                aria-label="Cancel Edit"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className={styles.createGroupButton}
              onClick={handleCreateGroup}
              disabled={isCreatingGroup || isUpdating}
              aria-label="Create Group"
            >
              {isCreatingGroup ? 'Creating...' : 'Create Group'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEditGroup;
