import { Modal, Select, Steps } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { extractSubRefundReason } from "../../utils/notificationUtils";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { SubscriptionPaymentHisDTO } from "../../types/subscriptionPayment/paymentTypes";

interface RefundModalProps {
  visible: boolean;
  onClose: () => void;
  record: SubscriptionPaymentHisDTO;
  onUpdateStatus: (_id: string, status: string, record: SubscriptionPaymentHisDTO) => void;
  onRefund: (record: SubscriptionPaymentHisDTO) => void;
}

const RefundModal: React.FC<RefundModalProps> = ({
  visible,
  onClose,
  record,
  onUpdateStatus,
  onRefund,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const notifications = useSelector(
    (state: RootState) => state.superAdminNotifications.notifications
  );
  useEffect(() => {
    setSelectedStatus(record?.refundStatus || "");
  }, [record]);
//   console.log("notifications", notifications);
  console.log("record", record);
  const reason = extractSubRefundReason(notifications, record._id);
  const status = record.refundStatus;
  const currentStepIndex =
    status === "Rejected"
      ? 2 // Show rejection on 3rd step
      : ["Pending", "Processing", "Refunded"].indexOf(status);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <h2 className="text-xl font-semibold text-green-700">
          Refund Request Details
        </h2>
      }
    >
      <Steps
        current={currentStepIndex}
        direction="horizontal"
        size="small"
        className="mb-6"
      >
        <Steps.Step
          title="Pending"
          icon={
            currentStepIndex === 0 ? (
              <ClockCircleOutlined style={{ color: "#faad14" }} />
            ) : (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            )
          }
          status={
            currentStepIndex > 0
              ? "finish"
              : currentStepIndex === 0
              ? "process"
              : "wait"
          }
        />

        <Steps.Step
          title="Processing"
          icon={
            currentStepIndex === 1 ? (
              <SyncOutlined spin style={{ color: "#1890ff" }} />
            ) : currentStepIndex > 1 ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <ClockCircleOutlined />
            )
          }
          status={
            currentStepIndex > 1
              ? "finish"
              : currentStepIndex === 1
              ? "process"
              : "wait"
          }
        />

        {status === "Rejected" ? (
          <Steps.Step
            title="Rejected"
            icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
            status="error"
          />
        ) : (
          <Steps.Step
            title="Refunded"
            icon={
              currentStepIndex === 2 ? (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              ) : (
                <ClockCircleOutlined />
              )
            }
            status={currentStepIndex === 2 ? "process" : "wait"}
          />
        )}
      </Steps>

      <div className="space-y-4 p-2 text-gray-800">
        <div>
          <p className="font-medium text-green-600">Plant Name:</p>
          {/* <p className="text-base">{record.pickupId}</p> */}
        </div>

        <div>
          <p className="font-medium text-green-600">Amount:</p>
          <p className="text-base">₹{record.amount}</p>
        </div>

        <div>
          <p className="font-medium text-green-600">Payment Status:</p>
          <p className="text-base">{record.status}</p>
        </div>
        <div>
          <p className="font-medium text-green-600 mb-1">Refund Reason:</p>
          <p className="text-base">{reason}</p>
        </div>
        {(record?.refundStatus !== "Refunded" &&
          record?.refundStatus !== "Rejected") && (
            <div>
              <p className="font-medium text-green-600 mb-1">
                Change Refund Status:
              </p>
              <Select
                className="w-full border border-green-400 rounded"
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Processing">Processing</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            </div>
          )}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50"
          >
            Cancel
          </button>
          {(record?.refundStatus !== "Refunded" &&
            record?.refundStatus !== "Rejected") && (
              <button
                onClick={() => onUpdateStatus(record._id, selectedStatus, record)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Status
              </button>
            )}
          {record?.refundStatus === "Processing" && (
            <button
              onClick={() => onRefund(record)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Refund
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RefundModal;
