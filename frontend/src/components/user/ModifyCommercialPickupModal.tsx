import {
  Modal,
  Typography,
  Radio,
  DatePicker,
  Select,
  Input,
  Button,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { ModifyCommercialPickupModalProps } from "../../types/common/modalTypes";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ModifyCommercialPickupModal = ({
  open,
  onClose,
  onSubmit,
  currentFrequency,
}: ModifyCommercialPickupModalProps) => {
  const [requestType, setRequestType] = useState<
    "Pause" | "FrequencyChange"
  >("Pause");

  const [pauseUntil, setPauseUntil] = useState<any>(null);
  const [newFrequency, setNewFrequency] = useState<string>(currentFrequency);

  const [reason, setReason] = useState("");
useEffect(() => {
  if (currentFrequency) {
    setNewFrequency(currentFrequency);
  }
}, [currentFrequency]);
  const handleSubmit = () => {
    onSubmit({
      requestType,
      pauseUntil,
      newFrequency,
      reason,
    });
  };
console.log({
      requestType,
      pauseUntil,
      newFrequency,
      reason,
    });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={550}
      title="Modify Commercial Pickup Schedule"
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Text type="secondary">
          Your recurring pickup schedule cannot be changed directly.
          Submit a request to the waste plant. They will review and
          approve your request.
        </Text>

        <div>
          <Title level={5}>Request Type</Title>

          <Radio.Group
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="Pause">
                Pause Recurring Pickup
              </Radio>

              <Radio value="FrequencyChange">
                Change Pickup Frequency
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        {requestType === "Pause" && (
          <>
            <div>
              <Text strong>Pause Until</Text>

              <DatePicker
                className="w-full mt-2"
                value={pauseUntil}
                onChange={(value) => setPauseUntil(value)}
                disabledDate = {(current) => {
                  const today = new Date();
                  today.setHours(23,59,59,999);
                  return current && current.toDate() <= today
                }}
              />
            </div>
          </>
        )}

        {requestType === "FrequencyChange" && (
          <>
            <div>
              <Text strong>Current Frequency</Text>

              <Input
                value={currentFrequency}
                disabled
                className="mt-2"
              />
            </div>

            <div>
              <Text strong>New Frequency</Text>

              <Select
                className="w-full mt-2"
                value={newFrequency}
                onChange={(value) => setNewFrequency(value)}
                options={[
                  {
                    value: "Daily",
                    label: "Daily",
                  },
                  {
                    value: "Weekly",
                    label: "Weekly",
                  },
                  {
                    value: "Monthly",
                    label: "Monthly",
                  },
                ]}
              />
            </div>
          </>
        )}

        <div>
          <Text strong>
            Reason <Text type="secondary">(Optional)</Text>
          </Text>

          <TextArea
            rows={4}
            placeholder="Provide any additional details..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>
            Cancel
          </Button>

          <Button type="primary" onClick={handleSubmit}>
            Submit Request
          </Button>
        </div>
      </Space>
    </Modal>
  );
};

export default ModifyCommercialPickupModal;