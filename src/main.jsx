import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CampaignProvider } from "./context/CampaignContext";
import App from "./App";
import "./assets/styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CampaignProvider>
          <App />
        </CampaignProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
