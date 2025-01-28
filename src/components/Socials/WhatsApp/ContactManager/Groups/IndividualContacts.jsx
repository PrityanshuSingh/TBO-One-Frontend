// src/components/WhatsAppModal/SendToIndividualContacts/SendToIndividualContacts.jsx

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Import icons
import styles from './styles/IndividualContacts.module.scss';

const SendToIndividualContacts = ({
  individualContactsSearch,
  setIndividualContactsSearch,
  selectedIndividualContacts,
  handleIndividualContactSelection,
  existingContacts,
  errors,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the section is expanded

  // Filtered contacts based on search term
  const filteredIndividualContacts = existingContacts.filter((contact) =>
    contact.name.toLowerCase().includes(individualContactsSearch.toLowerCase())
  );

  return (
    <div className={styles.sendIndividualSection}>
      {/* Header with toggle button */}
      <div className={styles.header}>
        <h3>Send to Individual Contacts</h3>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? 'Collapse Section' : 'Expand Section'}
        >
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className={styles.collapsibleContent}>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search Contacts by Name"
            value={individualContactsSearch}
            onChange={(e) => setIndividualContactsSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search Individual Contacts"
          />
          {/* List of Individual Contacts */}
          <div className={styles.individualContactsList}>
            {filteredIndividualContacts.length === 0 ? (
              <p>No contacts found.</p>
            ) : (
              filteredIndividualContacts.map((contact) => (
                <div key={contact.id} className={styles.individualContactItem}>
                  <input
                    type="checkbox"
                    id={`individual-contact-${contact.id}`}
                    checked={selectedIndividualContacts.includes(contact.id)}
                    onChange={() => handleIndividualContactSelection(contact.id)}
                    aria-label={`Select individual contact ${contact.name}`}
                  />
                  <label
                    htmlFor={`individual-contact-${contact.id}`}
                    className={styles.individualContactLabel}
                  >
                    {contact.name} ({contact.whatsApp})
                  </label>
                </div>
              ))
            )}
          </div>
          <div className={styles.selectedContacts}>
            {selectedIndividualContacts.length === 0 ? (
              <p>No individual contacts selected.</p>
            ) : (
              existingContacts
                .filter((contact) => selectedIndividualContacts.includes(contact.id))
                .map((contact) => (
                  <div key={contact.id} className={styles.contactChip}>
                    {contact.name} ({contact.whatsApp})
                    <button
                      className={styles.removeButton}
                      onClick={() => handleIndividualContactSelection(contact.id)}
                      aria-label={`Remove contact ${contact.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))
            )}
          </div>
          {errors && errors.individualContacts && (
            <div className={styles.errorText}>{errors.individualContacts}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SendToIndividualContacts;
