// src/pages/Packages/components/CampaignFilter.jsx

import React from 'react';
import styles from './styles/CampaignFilter.module.scss';

const CampaignFilter = ({ campaignFilter, onChange }) => {
  const handleSelect = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.campaignFilterWrapper}>
      <label htmlFor="campaignFilter" className={styles.campaignFilterLabel}>
        Filter Campaign
      </label>
      <select
        id="campaignFilter"
        value={campaignFilter}
        onChange={handleSelect}
        className={styles.campaignFilterSelect}
      >
        <option value="ALL">All</option>
        <option value="Running">Running</option>
        <option value="Stopped">Stopped</option>
        <option value="Hold">Hold</option>
      </select>
    </div>
  );
};

export default CampaignFilter;
