// src/components/Sections/PackageDetails/Header/Header.jsx

import React from "react";
import styles from "./styles/Header.module.scss";

const Header = ({
  title,
  isEditMode,
  onEdit,
  onSave,
  onCancel,
  isSaving,
  isAuthenticated,
  onInterestClick,
}) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        {isAuthenticated ? (
          isEditMode ? (
            <>
              <button
                className={styles.saveButton}
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className={styles.editButton} onClick={onEdit}>
              Edit
            </button>
          )
        ) : (
          <button className={styles.interestButton} onClick={onInterestClick}>
            Express Interest
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
