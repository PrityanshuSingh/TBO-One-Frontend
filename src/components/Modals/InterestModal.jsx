// src/components/Sections/PackageDetails/InterestModal/InterestModal.jsx

import React, { useState } from "react";
import styles from "./styles/InterestModal.module.scss";

const InterestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    suggestions: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    whatsappNumber: "",
    suggestions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors on change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", whatsappNumber: "", suggestions: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required.";
      valid = false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = "Invalid WhatsApp number format.";
      valid = false;
    }

    if (!formData.suggestions.trim()) {
      newErrors.suggestions = "Please provide your suggestions.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Express Your Interest</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="whatsappNumber">WhatsApp Number</label>
            <input
              type="text"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              className={errors.whatsappNumber ? styles.inputError : ""}
            />
            {errors.whatsappNumber && (
              <span className={styles.error}>{errors.whatsappNumber}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="suggestions">Prompt Suggestions</label>
            <textarea
              id="suggestions"
              name="suggestions"
              value={formData.suggestions}
              onChange={handleChange}
              className={errors.suggestions ? styles.inputError : ""}
            ></textarea>
            {errors.suggestions && (
              <span className={styles.error}>{errors.suggestions}</span>
            )}
          </div>

          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterestModal;
