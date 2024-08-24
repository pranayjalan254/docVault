import React from "react";
import Sidebar from "../sidebar/Sidebar";
import MainContent from "../MainContent/MainContent";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;
