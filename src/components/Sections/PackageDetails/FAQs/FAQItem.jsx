// src/components/FAQs/FAQItem.jsx

import React from "react";
import PropTypes from "prop-types";

import styles from "./styles//FAQItem.module.scss";

const FAQItem = ({ index, faq, onFAQChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFAQChange(index, name, value);
  };

  return (
    <div className={styles.fieldGroup}>
      <h4>FAQ {index + 1}</h4>
      <div className={styles.field}>
        <label htmlFor={`faqQuestion-${index}`}>Question:</label>
        <input
          type="text"
          id={`faqQuestion-${index}`}
          name="question"
          value={faq.question || ""}
          onChange={handleChange}
          className={styles.input}
          aria-required="false"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`faqAnswer-${index}`}>Answer:</label>
        <textarea
          id={`faqAnswer-${index}`}
          name="answer"
          value={faq.answer || ""}
          onChange={handleChange}
          className={styles.textarea}
          aria-required="false"
        />
      </div>
    </div>
  );
};

FAQItem.propTypes = {
  index: PropTypes.number.isRequired,
  faq: PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
  }).isRequired,
  onFAQChange: PropTypes.func.isRequired,
};

export default FAQItem;
