import { Button, Form, Input, Modal } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { PickupCancelData } from "../../types/wastePlantTypes";

interface CancelPickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickupId: string | null;
  cancelAction: (args: PickupCancelData) => any;
  onSuccess: () => void;
}
const InputMessage = ({
  visible,
  onClose,
  pickupId,
  cancelAction,
  onSuccess,
}: CancelPickupModalProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible]);

  if (!pickupId) return null;
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(
        cancelAction({
          pickupReqId: pickupId,
          reason: values.reason,
        })
      );
      console.log("Cancel Reason:", values.reason);
      toast.success("Pickup cancelled successfully");
      onSuccess();
      form.resetFields();
      onClose();
    } catch (err) {
      console.log("Validation error", err);
    }
  };
  return (
    <Modal
      open={visible}
      title={
        <h2 className="text-xl font-semibold text-green-600">Cancel Pickup</h2>
      }
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Reason for cancellation"
          name="reason"
          rules={[{ required: true, message: "Please enter a reason" }]}
        >
          <Input.TextArea rows={4} placeholder="Reason for cancellation" />
        </Form.Item>
        <Button type="primary" danger block onClick={handleSubmit}>
          Confirm Cancel
        </Button>
      </Form>
    </Modal>
  );
};

export default InputMessage;
