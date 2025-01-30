// src/pages/Packages/components/CategorySection.jsx

import React from 'react';
import TravelCard from '../Cards/PackageCard';
import styles from './styles/CategorySection.module.scss';

const CategorySection = ({
  tag,
  packages,
  filterValue,
  setFilterValue,
  onDetailsClick,
  getCampaignStatus
}) => {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <h2 className={styles.categoryTitle}>{tag} Packages</h2>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder={`Filter ${tag} packages...`}
          className={styles.categorySearch}
        />
      </div>

      <div className={styles.categoryContainer}>
        {packages.length > 0 ? (
          <div className={styles.cardsGrid}>
            {packages.map((pkg) => (
              <TravelCard
                key={pkg.id}
                id={pkg.id}
                packageTitle={pkg.packageTitle}
                image={pkg.image}
                location={pkg.location}
                duration={pkg.duration}
                price={pkg.price.basePrice}
                campaignStatus={getCampaignStatus(pkg.id)}
                onDetailsClick={() => onDetailsClick(pkg.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noPackagesMsg}>
            No packages found in {tag} category.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
