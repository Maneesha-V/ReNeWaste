import { Modal, DatePicker, Select, Form, Input } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import {
  disablePastDates,
  disableTimesAfterFive,
} from "../../utils/formatDate";
import { toast } from "react-toastify";
import { fetchDriversByPlace, reschedulePickup } from "../../redux/slices/wastePlant/wastePlantPickupSlice";

interface ReschedulePickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: any;
  onSubmit: (formData: any) => void;
}

const ReschedulePickupModal = ({
  visible,
  onClose,
  pickup,
  onSubmit,
}: ReschedulePickupModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { driver } = useSelector((state: RootState) => state.wastePlantPickup);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);

  useEffect(() => {
    if (pickup) {
      form.setFieldsValue({
        pickupDate: dayjs(pickup.originalPickupDate),
      });
    }
  }, [pickup, form]);
  useEffect(() => {
    if (visible && pickup?.wasteplantId) {
      dispatch(fetchDriversByPlace(pickup?.assignedZone));
    }
  }, [visible, pickup?.wasteplantId]);
  useEffect(() => {
    setFilteredDrivers(driver);
  }, [driver]);
  console.log("filteredDrivers",filteredDrivers);
  
  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ assignedZone: value });
    const filtered = driver.filter(
      (d: any) => d.assignedZone?.toLowerCase() === value.toLowerCase()
    );
    setFilteredDrivers(filtered);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const rescheduledDate = values.pickupDate
        ? dayjs(values.pickupDate).toISOString()
        : null;

      const formData = {
        driverId: values.driver,
        assignedZone: values.assignedZone,
        status: "Rescheduled",
        rescheduledPickupDate: rescheduledDate,
        pickupReqId: pickup._id,
      };

      await dispatch(reschedulePickup(formData));
      toast.success("Pickup rescheduled successfully");

      onClose();
      form.resetFields();
    } catch (err) {
      toast.error("Please check all fields");
    }
  };

  return (
    <Modal
      title="Reschedule Pickup"
      open={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={handleSubmit}
      okText="Reschedule"
    >
      <div className="mb-4 p-2 bg-gray-50 border rounded">
        <p>
          <strong>User:</strong> {pickup?.userName}
        </p>
        <p>
          <strong>Location:</strong> {pickup?.location}
        </p>
        <p>
          <strong>Pickup ID:</strong> {pickup?.pickupId}
        </p>
        <p>
          <strong>Current Pickup Date:</strong>{" "}
          {pickup?.originalPickupDate
            ? dayjs(pickup.originalPickupDate).format("DD-MM-YYYY")
            : "Not available"}
        </p>
        <p>
          <strong>Pickup Time:</strong> {pickup?.pickupTime}
        </p>
      </div>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="pickupDate"
          label="New Pickup Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD-MM-YYYY HH:mm"
            disabledDate={disablePastDates}
            disabledTime={(current) => disableTimesAfterFive(current)}
          />
        </Form.Item>

        <Form.Item
          label="Assign Zone"
          name="assignedZone"
          rules={[{ required: true, message: "Please enter zone" }]}
        >
          <Input placeholder="Enter zone" onChange={handleZoneChange} />
        </Form.Item>

        <Form.Item
          name="driver"
          label="Assign Driver"
          rules={[{ required: true, message: "Please assign a driver" }]}
        >
          <Select placeholder="Select a driver">
            {filteredDrivers.map((d: any) => (
              <Select.Option key={d._id} value={d._id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
       

      </Form>
    </Modal>
  );
};

export default ReschedulePickupModal;
