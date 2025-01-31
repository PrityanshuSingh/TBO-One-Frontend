// src/components/FAQs/FAQs.jsx

import React from "react";
import PropTypes from "prop-types";

import FAQItem from "./FAQItem";

import styles from "./styles/FAQs.module.scss";

const FAQs = ({
  isEditMode,
  faqs,
  onFAQChange,
}) => {
  return (
    <div className={`${styles.subSection} ${styles.faqs}`}>
      <h3>FAQs</h3>
      {isEditMode ? (
        <>
          {faqs?.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              faq={faq}
              onFAQChange={onFAQChange}
            />
          ))}
        </>
      ) : (
        faqs?.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <p>
              <strong>Q:</strong> {faq.question || "N/A"}
            </p>
            <p>
              <strong>A:</strong> {faq.answer || "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

FAQs.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.string,
    })
  ).isRequired,
  onFAQChange: PropTypes.func,
};

FAQs.defaultProps = {
  onFAQChange: () => {},
};

export default FAQs;
