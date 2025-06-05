import { Outlet } from "react-router-dom";
import { useState } from "react";
import SidebarWastePlant from "./SidebarWastePlant";
import Header from "./Header";
import Footer from "./Footer";
import MeasureWasteModal from "./MeasureWasteModal";
import { useAppDispatch } from "../../redux/hooks";
import { saveWasteMeasurement } from "../../redux/slices/wastePlant/wastePlantNotificationSlice";
import {
  MeasureDataPayload,
  SaveWasteMeasurementPayload,
} from "../../types/notificationTypes";
import { toast } from "react-toastify";

const WastePlantLayout = () => {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [measureModalData, setMeasureModalData] =
    useState<MeasureDataPayload | null>(null);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const handleOpenWasteModal = (data: MeasureDataPayload) => {
    setMeasureModalData(data);
  };

  const handleCloseWasteModal = () => {
    setMeasureModalData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <SidebarWastePlant collapsed={collapsed} isNotifOpen={isNotifOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            isNotifOpen={isNotifOpen}
            setIsNotifOpen={setIsNotifOpen}
            onOpenMeasureWaste={handleOpenWasteModal}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
      {measureModalData && (
        <MeasureWasteModal
          vehicleNumber={measureModalData.vehicleNumber}
          driverName={measureModalData.driverName}
          returnedAt={measureModalData.returnedAt}
          onClose={handleCloseWasteModal}
          onSave={(weight) => {
            console.log("Saving...", { ...measureModalData, weight });
            // const payload: MeasureDataPayload = { ...measureModalData, weight };
            if (!measureModalData?.notificationId) {
              toast.error("Notification ID is missing.");
              return;
            }

            const payload: SaveWasteMeasurementPayload = {
              notificationId: measureModalData.notificationId,
              weight,
            };
            dispatch(saveWasteMeasurement(payload))
              .unwrap()
              .then(() => {
                toast.success("Waste measurement saved successfully!");
                handleCloseWasteModal();
              })
              .catch((err) => {
                toast.error(
                  typeof err === "string" ? err : "Failed to save measurement."
                );
              });
          }}
        />
      )}
    </div>
  );
};

export default WastePlantLayout;
