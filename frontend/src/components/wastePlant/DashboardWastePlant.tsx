import { useState } from "react";;
import Footer from "./Footer";
import MainContent from "../common/MainContent";

import DashboardContent from "../../pages/wastePlant/DashboardWastePlant";
import SidebarWastePlant from "./SidebarWastePlant";
import Header from "./Header";


const DashboardWastePlant = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const toggleCollapse = () => setCollapsed(!collapsed);

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      // case "pickups":
      //   return <PickupManagement />;
      // case "drivers":
      //   return <DriverManagement />;
      // case "trucks":
      //   return <TruckManagement />;
      // case "waste-reports":
      //   return <WasteReports />;
      // case "pay-and-earn":
      //   return <PayAndEarn />;
      // case "subscription":
      //   return <Subscription />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <SidebarWastePlant 
          collapsed={collapsed} 
        />
        
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

export default DashboardWastePlant;
