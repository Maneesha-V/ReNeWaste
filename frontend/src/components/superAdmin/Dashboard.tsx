import { useState } from "react";
import Header from "../../components/superAdmin/Header";
import Sidebar from "../../components/superAdmin/Sidebar";
import MainContent from "../../components/superAdmin/MainContent";
import DashboardContent from "../../pages/superAdmin/DashboardContent";
import Footer from "../superAdmin/Footer";
import WastePlants from "../../pages/superAdmin/WastePlants";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const toggleCollapse = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "waste-plants":
        return <WastePlants />;
      // Add other cases for different menu items
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} />
        
        <div className="flex-1 flex flex-col">
          <Header collapsed={collapsed} toggleCollapse={toggleCollapse} />
          <MainContent>
            {renderContent()}
          </MainContent>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;