import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaRegAddressCard,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import styles from './styles/SideBar.module.scss';

// Import your AuthContext
import { AuthContext } from '../../context/AuthContext';

// Example fallback JSON file path (adjust as needed)
import FALLBACK_PROFILE_JSON from  '../../data/localProfile.json';

function Sidebar() {

  const navigate = useNavigate();
  const { isAuthenticated, userData, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State to store local/fallback data
  const [profileData, setProfileData] = useState({
    name: 'Executive Name',
    company: 'Company Name',
    address: 'Company Short Address',
  });

  useEffect(() => {
    // Adjust isMobile on window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // If user is authenticated and userData is available, use it
    if (isAuthenticated && userData) {
      setProfileData({
        name: userData.Member.FirstName || 'Executive Name',
        company: userData.Profile.company || 'Company Name',
        address: userData.Profile.address || 'Company Short Address',
      });
    } else {
      // Not authenticated, fetch from local JSON
      const data = FALLBACK_PROFILE_JSON;
    setProfileData({
      name: data.Member.FirstName || 'Executive Name',
      company: data.Profile.company || 'Company Name',
      address: data.Profile.address || 'Company Short Address',
    });
  }
  }, [isAuthenticated, userData]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  const handleLogout=()=>{
    logout();
    navigate('/login');
  }

  const navItems = [
    { path: '/', text: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/u/packages', text: 'Packages', icon: <FaBox /> },
    { path: '/u/campaigns', text: 'Campaigns', icon: <FaUsers /> },
    { path: '/u/interests', text: 'Interests', icon: <FaRegAddressCard /> },
    { path: '/u/socials', text: 'GenAI Socials', icon: <FaRegAddressCard /> },
  ];

  return (
    <>
      {isMobile && (
        <div className={styles.mobileHeader}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/4aa0ae1a0e814437847f3f8ff6c4ef38/c578015e8606763f9e8adcdfdd8f61741209ff6ceba17ba0c052d62d6d8182b5?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&"
            className={styles.mobileLogo}
            alt="TBO One Logo"
            loading="lazy"
          />
          <button
            className={styles.menuToggle}
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      )}

      <div className={`${styles.sidebarContainer} ${isOpen ? styles.active : ''}`}>
        <div className={styles.sidebarWrapper}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/4aa0ae1a0e814437847f3f8ff6c4ef38/c578015e8606763f9e8adcdfdd8f61741209ff6ceba17ba0c052d62d6d8182b5?apiKey=4aa0ae1a0e814437847f3f8ff6c4ef38&"
            className={styles.logo}
            alt="TBO One Logo"
            loading="lazy"
          />
          <div className={styles.brandTitle}>TBO-One</div>
          <div className={styles.brandSubtitle}>powered by TBO.com</div>

          <div className={styles.navContainer}>
            <div className={styles.navItems}>
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                  }
                  onClick={closeSidebar}
                >
                  <span className={styles.icon}>{item.icon}</span> {item.text}
                </NavLink>
              ))}

              <button
                className={`${styles.navLink} ${styles.logoutButton}`}
                onClick={handleLogout}
              >
                <span className={styles.icon}><FaSignOutAlt /></span>
                Logout
              </button>
            </div>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileName}>{profileData.name}</div>
            <div className={styles.profileCompany}>{profileData.company}</div>
            <div className={styles.profileAddress}>{profileData.address}</div>
            <button className={styles.profileButton}>Visit Profile</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
