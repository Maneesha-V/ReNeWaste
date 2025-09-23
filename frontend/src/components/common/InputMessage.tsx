import { Button, Form, Input, Modal } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { updateCancelPickupReason } from "../../redux/slices/user/userPickupSlice";
import { CancelPickupModalProps } from "../../types/common/modalTypes";

const InputMessage = ({
  visible,
  onClose,
  pickupId,
  cancelAction,
}: CancelPickupModalProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible, form]);

  if (!pickupId) return null;
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await dispatch(
        cancelAction({
          pickupReqId: pickupId,
          reason: values.reason,
        })
      ).unwrap();
      console.log("Cancel Reason:", values.reason);
       console.log("Respon:", res);
      toast.success(res.message);
      await dispatch(updateCancelPickupReason({ pickupReqId: pickupId, payment: res.payment }))
      // onSuccess();
      form.resetFields();
      onClose();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
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
