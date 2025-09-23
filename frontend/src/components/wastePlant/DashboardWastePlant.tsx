import { useState } from "react";;
import Footer from "./Footer";
import MainContent from "../common/MainContent";

import DashboardContent from "../../pages/wastePlant/DashboardWastePlant";
import SidebarWastePlant from "./SidebarWastePlant";
import Header from "./Header";
import { MeasureDataPayload } from "../../types/wasteCollections/wasteCollectionTypes";


const DashboardWastePlant = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu] = useState("dashboard");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

   const handleOpenMeasureWaste = (data: MeasureDataPayload) => {
    console.log("Measure Waste modal data:", data);
  };
  
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
          collapsed={collapsed} isNotifOpen={false}        />
        
        <div className="flex-1 flex flex-col">
          <Header 
            collapsed={collapsed} 
            toggleCollapse={toggleCollapse} 
            isNotifOpen={isNotifOpen}
            setIsNotifOpen={setIsNotifOpen}
            onOpenMeasureWaste={handleOpenMeasureWaste}
            />
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
