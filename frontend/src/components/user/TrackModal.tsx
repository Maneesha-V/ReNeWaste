import { Modal, Steps } from "antd";

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

const TrackModal = ({ visible, onClose, trackingStatus, pickupId, eta }: TrackModalProps) => {
  const currentStep = statusToStep(trackingStatus);

  return (
    <Modal
      title={`Tracking - ${pickupId}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
        {eta?.text && currentStep >= 0 && (
        <div className="mb-4 text-blue-600 font-medium">
          Estimated Arrival: {eta.text}
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
          status={trackingStatus === "Completed" ? "finish" : "process"}
        >
          <Step title="Assigned" description="Driver has been assigned." />
          <Step title="In Transit" description="Driver is on the way." />
          <Step title="Near" description="Driver is near your location." />
          <Step title="Arrived" description="Driver has arrived at your location." />
          <Step title="Completed" description="Pickup completed successfully." />
        </Steps>
      )}
    </Modal>
  );
};

export default TrackModal;
