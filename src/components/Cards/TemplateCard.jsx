// src/components/Cards/TemplateCard.jsx
import React from 'react';
import styles from './styles/TemplateCard.module.scss';

const TemplateCard = ({ template, onSelect, isSelected }) => {
  const handleClick = () => {
    onSelect(template);
  };

  // Minimal data for preview
  const previewHtml = template.html
    .replace(/{{agentName}}/g, 'AgentPreview')
    .replace(/{{agentContact}}/g, '+1 123456789')
    .replace(/{{agentEmail}}/g, 'preview@example.com')
    .replace(/{{caption}}/g, 'Sample caption...');

  return (
    <div
      className={`${styles.templateCard} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <h3>{template.name}</h3>
      <div
        className={styles.templatePreviewWrapper}
      >
        <div
          className={styles.templatePreview}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

export default TemplateCard;
