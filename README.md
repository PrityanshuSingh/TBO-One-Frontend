## TBO-One Frontend

### Overview

TBO-One is an all-in-one personalized platform for travel agents to manage their packages and retain customers more efficiently using our AI recommendation model. The platform provides a seamless interface for agents to create, customize, and optimize travel packages while leveraging AI to suggest the best options for their clients.

### Features

#### User-Focused Features:

- **Personalized AI Recommendations**: Travel agents receive AI-powered package suggestions based on customer preferences.
- **Package Management**: Easily create, edit, and manage travel packages.
- **User Authentication**: Secure login and session management for agents.
- **Customer Retention Tools**: AI-driven insights to increase customer engagement and rebookings.
- **Responsive Design**: Optimized for both desktop and mobile experiences.

#### Administrator-Focused Features:

- **Admin Dashboard**: Manage users, monitor activity, and access analytics.
- **User and Role Management**: Assign roles and access levels to different agents.
- **Data Analytics**: View insights into package popularity, customer trends, and performance metrics.

### Tech Stack

- **Frontend**: ReactJS with Vite
- **Package Manager**: Bun
- **State Management**: Context API
- **Styling**: SCSS for modular and maintainable styles

### How to Run Locally

To run TBO-One Frontend locally on your machine, follow these steps:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/PrityanshuSingh/TBO-One-Frontend.git
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd TBO-One-Frontend
   ```

3. **Install Bun Package Manager** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
   Then restart your terminal and verify installation with:
   ```bash
   bun -v
   ```

4. **Install Dependencies**:
   ```bash
   bun install
   ```

5. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory and add the required environment variables:
     ```
     VITE_API_BASE_URL=your-api-url
     VITE_TBO_CLIENT_ID=your-client-id
     VITE_TBO_AUTH_URL=your-auth-url
     VITE_TBO_LOGOUT_URL=your-logout-url
     ```

6. **Start Development Server**:
   ```bash
   bun run dev
   ```

7. **Access Local Deployment**:
   Open your browser and navigate to `http://localhost:5173` to view TBO-One Frontend locally.

### Fork and Contribution

If you would like to contribute to TBO-One, follow these steps:

1. **Fork Repository**:
   Click the "Fork" button on the top-right corner of the GitHub repository page.

2. **Clone Your Fork and Set Up the Cloned Repo**:
   ```bash
   git clone https://github.com/your-username/TBO-One-Frontend.git
   ```

3. **Syncing Fork with Original Repository:**
   - Add an upstream remote to pull changes from the original repository.
   ```bash
   git remote add upstream https://github.com/PrityanshuSingh/TBO-One-Frontend.git
   ```
   - Fetch upstream changes.
   ```bash
   git fetch upstream
   ```

4. **Create New Branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```
   - Merge the latest changes locally.
   ```bash
   git merge upstream/main
   ```

5. **Make Changes**:
   Implement your changes and commit them.

6. **Push Changes**:
   ```bash
   git push origin feature/my-new-feature
   ```

7. **Create Pull Request**:
   Go to your forked repository on GitHub and click on "New Pull Request" to submit your changes for review.

### Acknowledgements

TBO-One is built and maintained by [Prityanshu Singh](https://github.com/PrityanshuSingh) and contributors. Special thanks to all open-source libraries and frameworks used in this project.

### Screenshots

Include screenshots of TBO-One Frontend in action:

1. Dashboard View
2. AI-Powered Package Recommendations
3. Package Management Interface
4. Admin Dashboard

---

Feel free to reach out for any inquiries or assistance regarding TBO-One. Happy coding!

