import { Modal, Steps } from "antd";
import { useSocket } from "../../context/SocketContext";
import { useEffect, useState } from "react";

const { Step } = Steps;

interface TrackModalProps {
  visible: boolean;
  onClose: () => void;
  trackingStatus: string | null;
  pickupId: string;
  eta: { text: string | null } | null;
}

const statusToStep = (status: string | null): number => {
  switch (status) {
    case "Assigned":
      return 0;
    case "InTransit":
      return 1;
    case "Near":
      return 2;
    case "Arrived":
      return 3;
    case "Completed":
      return 4;
    default:
      return -1;
  }
};

const TrackModal = ({
  visible,
  onClose,
  trackingStatus,
  pickupId,
  eta,
}: TrackModalProps) => {
  const [localTrackingStatus, setLocalTrackingStatus] = useState<string | null>(
    trackingStatus
  );
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const currentStep = statusToStep(localTrackingStatus);
  const socket = useSocket();
  useEffect(() => {
    if (visible && trackingStatus) {
      setLocalTrackingStatus(trackingStatus);
    }
  }, [visible, trackingStatus]);

  useEffect(() => {
    if (!socket) return;
    if (visible && pickupId) {
      socket.emit("joinPickupRoom", pickupId);

      socket.on("driverLocationBroadcast", ({ latitude, longitude }) => {
        setDriverLocation({ latitude, longitude });
        console.log("📍 Live driver location:", latitude, longitude);
      });

      socket.on("trackingStatusUpdated", (status: string) => {
        console.log("📦 Tracking status updated:", status);
        setLocalTrackingStatus(status);
      });
      return () => {
        socket.off("driverLocationBroadcast");
        socket.off("trackingStatusUpdated");
        socket.emit("leavePickupRoom", pickupId);
      };
    }
  }, [visible, pickupId]);
  console.log("trackingStatus", trackingStatus);
  console.log("localTrackingStatus", localTrackingStatus);
  return (
    <Modal
      title={`Tracking - ${pickupId}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {/* {eta?.text && currentStep >= 0 && (
        <div className="mb-4 text-blue-600 font-medium">
          Estimated Arrival: {eta.text}
        </div>
      )} */}
      {eta?.text && localTrackingStatus === "Assigned" && (
        <div className="mb-4 text-blue-600 font-medium">
          Estimated Arrival: {eta.text}
        </div>
      )}

      {driverLocation && (
        <div className="mb-3 text-green-700 font-medium">
          Live Driver Location: Lat {driverLocation.latitude}, Lng{" "}
          {driverLocation.longitude}
        </div>
      )}
      {currentStep === -1 ? (
        <div className="text-yellow-600 text-lg font-medium">
          Driver has not been assigned yet.
        </div>
      ) : (
        <Steps
          current={currentStep}
          direction="vertical"
          size="small"
          status={localTrackingStatus === "Completed" ? "finish" : "process"}
        >
          <Step title="Assigned" description="Driver has been assigned." />
          <Step title="In Transit" description="Driver is on the way." />
          <Step title="Near" description="Driver is near your location." />
          <Step
            title="Arrived"
            description="Driver has arrived at your location."
          />
          <Step
            title="Completed"
            description="Pickup completed successfully."
          />
        </Steps>
      )}
    </Modal>
  );
};

export default TrackModal;
