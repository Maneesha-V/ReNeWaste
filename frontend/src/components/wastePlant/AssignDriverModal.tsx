import { Modal, Select, Input, Form, Button } from "antd";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { fetchDrivers } from "../../redux/slices/driver/profileDriverSlice";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { approvePickup } from "../../redux/slices/wastePlant/wastePlantPickupSlice";

interface AssignDriverModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: any;
  onSuccess: () => void;
}

const AssignDriverModal = ({
  visible,
  onClose,
  pickup,
  onSuccess,
}: AssignDriverModalProps) => {
  const dispatch = useAppDispatch();
  const { driver } = useSelector((state: RootState) => state.driverProfile);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && pickup?.wasteplantId) {
      dispatch(fetchDrivers(pickup.wasteplantId));
    }
  }, [visible, pickup?.wasteplantId]);

  const handleAssign = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(approvePickup({
        pickupReqId: pickup._id,
        pickupId: pickup.pickupId,
        status: "Scheduled",
        driverId: values.driver,
        assignedZone: values.assignedZone,
      })).unwrap(); 
  
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to assign pickup", err);
    }
  };

  return (
    <Modal
      open={visible}
      title={
        <h2 className="text-xl font-semibold text-green-600">Assign Pickup</h2>
      }
      onCancel={onClose}
      footer={null}
    >
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>PickupID:</strong> {pickup?.pickupId}
          </p>
          <p>
            <strong>User:</strong> {pickup?.userName}
          </p>
          <p>
            <strong>Location:</strong> {pickup?.location}
          </p>
          <p>
            <strong>Pickup Date:</strong>{" "}
            {pickup?.originalPickupDate &&
              new Date(pickup.originalPickupDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Pickup Time:</strong> {pickup?.pickupTime}
          </p>
        </div>

        <div>
          <p>
            <strong>Address:</strong>
          </p>
          {pickup?.userAddress && (
            <div className="text-sm text-gray-700 leading-relaxed ml-2">
              <p>{pickup.userAddress.addressLine1}</p>
              <p>{pickup.userAddress.location}</p>
              <p>{pickup.userAddress.taluk}</p>
              <p> {pickup.userAddress.pincode}</p>
            </div>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Assign Driver"
          name="driver"
          rules={[{ required: true, message: "Please select a driver" }]}
        >
          <Select placeholder="Select Driver">
            {Array.isArray(driver) &&
              driver.map((driver: any) => (
              <Select.Option key={driver._id} value={driver._id}>
                {driver.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Assign Zone"
          name="assignedZone"
          rules={[{ required: true, message: "Please enter zone" }]}
        >
          <Input placeholder="Enter zone" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAssign}>
            Assign & Approve
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignDriverModal;
