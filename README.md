# TBO-One - AI Powered Travel CRM

**TBO-One** is an all-in-one, AI-powered platform designed specifically for travel agents. It empowers agents to create, customize, and optimize travel packages while managing customer relationships effectively. Leveraging TBO’s extensive travel inventory and modern technologies—including the MERN stack and AI/ML tools—TBO-One provides personalized package recommendations, campaign management, customer and loyalty programs, and targeted social media automation.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Fork and Contribution](#fork-and-contribution)
- [ScreenShots](#screenshots)
- [Documentation and References](#documentation-and-references)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

---

## Introduction

This project’s Software Requirements Specification (SRS) captures all the essential requirements for the TBO-One Travel Agent Empowerment Platform. The platform is developed to:

- **Empower travel agents:** Provide tools for personalized travel package creation, customer retention, and campaign management.
- **Leverage AI/ML:** Offer personalized recommendations and actionable insights by processing both historical and real-time data.
- **Enhance operational efficiency:** Integrate automated workflows to streamline routine tasks and support future data-driven enhancements.
- **Integrate modern technologies:** Utilize TBO’s extensive travel inventory with cutting-edge web technologies (MERN stack) and AI/ML frameworks (Flask, scikit-learn).

This README serves as a comprehensive guide for project stakeholders, developers, testers, and maintainers.

---

## Features

### User-Focused Features

- **Personalized AI Recommendations:**  
  - Leverages machine learning (scikit-learn with Flask) to analyze customer data and market trends.
  - Provides tailored travel package suggestions to enhance customer satisfaction and conversion rates.

- **Package Management:**  
  - Create, edit, and manage travel packages interactively.
  - Integrates TBO’s live inventory with real-time cost and availability updates.
  - Supports drag-and-drop functionality for an intuitive package builder.

- **User Authentication and Profile Management:**  
  - Secure registration and login via email/password and OAuth (Google, Facebook).
  - Implements JWT-based session management and secure logout.
  - Allows profile updates and password resets.

- **Marketing Automation:**  
  - Tools for creating, scheduling, and managing social media campaigns.
  - Automated email and SMS notifications to engage customers.
  - Supports loyalty program management with customer segmentation.

- **Mobile-Friendly, Responsive Design:**  
  - Optimized for desktops, tablets, and smartphones.
  - Includes mobile-specific features like push notifications and quick-access menus.
  - Complies with accessibility standards (WCAG 2.1).

- **Automated Workflows:**  
  - Streamlines routine tasks (campaigns, follow-ups and customer personalized package development) to enhance operational efficiency.
  - Provides immediate feedback in the package builder as components are updated.

- **Security and Compliance:**  
  - Ensures secure data transmission using HTTPS.
  - Implements encryption for sensitive data and regular vulnerability assessments.
  - Complies with data privacy regulations such as GDPR and CCPA.

### Additional Features

- **Comprehensive User Roles and Access Control:**  
  - Supports multiple user groups (travel agents, administrators, marketing specialists, data analysts) with tailored access levels.

- **Real-Time Notifications:**  
  - (Optional) WebSocket integration for immediate updates on campaign performance and system events.

- **Integration with Third-Party APIs:**  
  - Connects with TBO’s inventory systems, social media platforms, and communication gateways (email/SMS) for extended functionality.

- **Customizable Reporting:**  
  - Future capabilities will include options for exporting data and generating reports for offline analysis and stakeholder presentations.

---

## Tech Stack

- **Frontend:** ReactJS with Vite – A modern framework for building dynamic single-page applications.
- **Backend:** Express.js on Node.js – Provides robust server-side logic and API management.
- **Database:** MongoDB – Efficient storage and retrieval of data.
- **Package Manager:** Bun – A fast and modern package manager.
- **State Management:** React Context API – Simplifies global state handling.
- **Styling:** SCSS – Modular and maintainable styles.
- **AI/ML Integration:** Python with Flask – Serves machine learning models built using scikit-learn to power personalized recommendations.

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/PrityanshuSingh/TBO-One-Frontend.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd TBO-One-Frontend
   ```

3. **Install Bun Package Manager** (if not already installed):

   For **Linux/Mac**:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
   For **Windows**:
   ```bash
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```
   Alternatively, you can install Bun globally using npm (applicable for Windows, Linux, and Mac):
   ```bash
   npm install -g bun
   ```
   Then restart your terminal and verify the installation with:
   ```bash
   bun -v
   ```

4. **Install Dependencies:**
   ```bash
   bun install
   ```

5. **Set Up Environment Variables:**
   - Create a test `.env` file in the root directory and add the required environment variables to test your local setup:
     ```
     VITE_API_BASE_URL=YOUR_API_URL
     VITE_TBO_API_BASE_URL=YOUR_TBO_API_URL
     VITE_TBO_COUNTRYLIST_URL=YOUR_COUNTRYLIST_ENDPOINT
     VITE_TBO_CITYLIST_URL=YOUR_CITYLIST_ENDPOINT
     ```

6. **Start Development Server:**
   ```bash
   bun run dev
   # or
   npm run dev


7. **Access Local Deployment:**
   Open your browser and navigate to `http://localhost:5173` to view TBO-One Frontend locally.

---

## Fork and Contribution

If you would like to contribute to TBO-One, follow these steps:

1. **Fork the Repository:**
   - Click the "Fork" button on the top-right corner of the GitHub repository page.

2. **Clone Your Fork and Set Up the Cloned Repo:**
   ```bash
   git clone https://github.com/your-username/TBO-One-Frontend.git
   ```

3. **Syncing Fork with the Original Repository:**
   - Add an upstream remote to pull changes from the original repository:
     ```bash
     git remote add upstream https://github.com/PrityanshuSingh/TBO-One-Frontend.git
     ```
   - Fetch upstream changes:
     ```bash
     git fetch upstream
     ```

4. **Create a New Branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
   - Merge the latest changes from upstream:
     ```bash
     git merge upstream/main
     ```

5. **Make Your Changes:**
   - Implement your modifications and commit them with clear, descriptive messages.

6. **Push Your Changes:**
   ```bash
   git push origin feature/my-new-feature
   ```

7. **Submit a Pull Request:**
   - Go to your forked repository on GitHub and click "New Pull Request" to submit your changes for review.

---

## Screenshots

- **AI-Powered Package Recommendations:** Showcasing personalized travel package suggestions.
![image](https://github.com/user-attachments/assets/e34a59b0-175f-4f81-8e62-05c27233ea1e)


- **Campaign Manangement:** Demonstrating the interactive whatsApp campaign management.
![image](https://github.com/user-attachments/assets/6627a581-ca7b-4df6-b6ff-81836e188ed5)


- **Customer Personalized Package Generation:** Customizing Packages using AI based on customer's need and preferences.
![image](https://github.com/user-attachments/assets/e454af4d-92a0-46a6-9b89-651791e93cb5)


- **Social Media GenAI Integration:** Illustrating Instagram Posts and Ads generation automation with predefined templates.
![image](https://github.com/user-attachments/assets/269e9a9c-fd84-49c8-a32e-d1018859eb74)


---

## Documentation and References

- **SRS Documentation:**  
  Detailed Software Requirements Specification (SRS) outlining the system’s objectives, scope, and functionalities.
  [SRS Document](https://docs.google.com/document/d/1zctQLjKve1-x8Rq6wjXzjg7k4mLKzZkz0N2cIJWhCoc/edit?usp=sharing)

- **PostMan API Collection:**  
  [Postman API Collection Link](https://tinyurl.com/5n6phsyc)

- **Live Hosted Link:**  
  [TBO-One Live Link](https://docs.google.com/document/d/1zctQLjKve1-x8Rq6wjXzjg7k4mLKzZkz0N2cIJWhCoc/edit?usp=sharing)

- **TBO-One Backend Link:**  
  [TBO-One Backend Link](https://github.com/PrityanshuSingh/TBO-One-Backend)

- **TBO-One AI Model Link:**  
  [TBO-One AI Model Link](https://github.com/amaldeeppatra/tbo-place-recommendation-api)

- **Reference Video:**  
  [Demo Video Link](https://drive.google.com/file/d/1gIZSc7z7gtSuOxfw792d4Leo6gI5lhOM/view?usp=drive_link)

---

## Future Enhancements

- **Real-Time Analytics Dashboard:**  
  A comprehensive analytics dashboard featuring interactive data visualizations and key performance indicators (KPIs) is planned for future releases.
- **Mobile App Integration:**  
  Development of native mobile applications to provide travel agents with enhanced on-the-go access and functionality.
- **Advanced Reporting and Export Capabilities:**  
  Enhanced reporting tools that support additional export formats (e.g., Excel, PDF) and customizable report generation.
- **Chatbot and Virtual Assistant Integration:**  
  Integration of AI-driven chatbots to assist travel agents with quick access to critical information and streamlined inquiry management.

---


## Acknowledgements

TBO-One is built and maintained by team Veltrix during VoyageHack2.0 Hackathon which inlcudes contributors : [Prityanshu Singh](https://github.com/PrityanshuSingh), [Prakash Pramanick](https://github.com/prakash2003pramanick) and [Amaldeep Patra](https://github.com/amaldeeppatra). Special thanks to all the open-source libraries and frameworks powering this project, including React, Express.js, MongoDB, Bun, SCSS, Flask, and scikit-learn and the TBO API Inventory provided for reference.

Happy Coding and Travelling!
