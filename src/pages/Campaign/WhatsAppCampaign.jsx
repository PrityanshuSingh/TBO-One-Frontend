// src/components/WhatsAppModal/WhatsAppCampaign.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import WhatsAppModal from '../../components/Modals/WhatsAppModal';
import { AuthContext } from '../../context/AuthContext';
import { CampaignContext } from '../../context/CampaignContext';
import api from "../../utils/api";

const WhatsAppCampaign = () => {
  const { id } = useParams(); // Extract ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        // Attempt to get package data from location.state
        let data = location.state;
        console.log('Package Data from location.state:', data);

        if (!data) {
          // If not available, fetch from savedPackages
          data = userData?.Profile?.savedPackages?.find(pkg => pkg.id === id);
          console.log('Package Data from savedPackages:', data);
        }

        if (!data) {
          // If still not found, fetch from backend
          const response = await api.get(`/api/packages?=${id}`);
          data = response.data;
          console.log('Package Data from backend:', data);
        }

        if (data) {
          setPackageData(data);
        } else {
          throw new Error('Package data not found.');
        }
      } catch (err) {
        console.error('Error fetching package data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [id, location.state, userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!packageData) {
    navigate('/u/packages'); // Redirect if package data is missing
    return null;
  }

  return (
    <WhatsAppModal 
      isOpen={true} 
      onClose={() => navigate('/u/packages')} 
      packageData={packageData} 
    />
  );
};

export default WhatsAppCampaign;
