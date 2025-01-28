// src/components/WhatsAppModal/SelectGroups/SelectGroups.jsx

import React from 'react';
import styles from './styles/SelectGroups.module.scss';

const SelectGroups = ({ existingGroups, selectedGroups, handleGroupSelection, handleEditGroup }) => {
  return (
    <div className={styles.selectGroupSection}>
      <h3>Select Groups</h3>
      <div className={styles.groupsList}>
        {existingGroups.length === 0 ? (
          <p>No WhatsApp groups available.</p>
        ) : (
          existingGroups.map((group) => (
            <div key={group.id} className={styles.groupItem}>
              <input
                type="checkbox"
                id={`send-group-${group.id}`}
                checked={selectedGroups.includes(group.id)}
                onChange={() => handleGroupSelection(group.id)}
                aria-label={`Select group ${group.name}`}
              />
              <label htmlFor={`send-group-${group.id}`} className={styles.groupLabel}>
                {group.name} ({group.contactId.length} contacts)
              </label>
              <button
                className={styles.editGroupButton}
                onClick={() => handleEditGroup(group)}
                aria-label={`Edit group ${group.name}`}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectGroups;
