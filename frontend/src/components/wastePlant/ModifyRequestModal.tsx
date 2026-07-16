import { Modal, Typography, Button, Divider } from "antd";
import { ModifyRequestModalProps } from "../../types/common/modalTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const { Text } = Typography;

const ModifyRequestModal = ({
  open,
  onClose,
  pickup,
  onApprove,
  onReject
}: ModifyRequestModalProps) => {
  if (!pickup) return null;

  const notifications = useSelector((state: RootState)=>state.wastePlantNotifications.notifications);
  const modifyNotification  = notifications.find((n)=>
    n.pickupRequestId === pickup._id && n.type === "pickup_modify-req"
  )
  const reason = modifyNotification?.message.split("Reason: ")[1] || "-";
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      title="Commercial Pickup Modification"
      width={600}
    >
      <div className="space-y-4">

        <div>
          <Text strong>Pickup ID:</Text>
          <br />
          <Text>{pickup.pickupId}</Text>
        </div>

        <div>
          <Text strong>Business Name:</Text>
          <br />
          <Text>{pickup.businessName}</Text>
        </div>

        <div>
          <Text strong>Current Frequency:</Text>
          <br />
          <Text>{pickup.frequency}</Text>
        </div>

        <Divider />

        <div>
          <Text strong>Request Type:</Text>
          <br />
          <Text>{pickup.requestType}</Text>
        </div>
 
        {pickup.requestType === "FrequencyChange" && (
          <div>
            <Text strong>Requested Frequency:</Text>
            <br />
            <Text>{pickup.requestedFrequency}</Text>
          </div>
        )}

        {pickup.requestType === "Pause" && (
          <div>
            <Text strong>Pause Until:</Text>
            <br />
            <Text>
              {pickup.pauseUntil
                ? new Date(pickup.pauseUntil).toLocaleDateString()
                : "-"}
            </Text>
          </div>
        )}

        <div>
          <Text strong>Reason:</Text>
          <br />
          <Text>{reason}</Text>
        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            danger
            onClick={() => onReject(pickup._id)}
          >
            Reject
          </Button>

          <Button
            type="primary"
            onClick={() => onApprove(pickup._id)}
          >
            Approve
          </Button>

        </div>

      </div>
    </Modal>
  );
};

export default ModifyRequestModal;