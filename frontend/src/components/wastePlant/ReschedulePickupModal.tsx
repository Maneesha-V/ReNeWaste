import { Modal, DatePicker, Select, Form, Input } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { disablePastDates } from "../../utils/formatDate";
import { toast } from "react-toastify";
import {
  fetchDriversByPlace,
  reschedulePickup,
} from "../../redux/slices/wastePlant/wastePlantPickupSlice";
import { ReschedulePickupModalProps } from "../../types/wastePlantTypes";


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
  console.log("filteredDrivers", filteredDrivers);

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
      const selectedDateTime = dayjs(values.pickupDate);
      const now = dayjs();

      // Business logic validation
      const hour = selectedDateTime.hour();
      const minute = selectedDateTime.minute();

      // If user selects today
      if (selectedDateTime.isSame(now, "day")) {
        // If selected time is in the past
        if (selectedDateTime.isBefore(now)) {
          toast.error("Please select a future time for today's date");
          return;
        }

        // If the current time is already past 5 PM, no valid time left
        if (now.hour() >= 17) {
          toast.error(
            "No available time left today, please select a future date"
          );
          return;
        }
      }

      // Reject if time is before 9am or after 5pm
      if (hour < 9 || (hour === 17 && minute > 0) || hour > 17) {
        toast.error("Pickup time must be between 9:00 AM and 5:00 PM");
        return;
      }
      const pickupTime = selectedDateTime.format("HH:mm");

      const formData = {
        driverId: values.driver,
        assignedZone: values.assignedZone,
        status: "Rescheduled",
        rescheduledPickupDate: selectedDateTime.toISOString(),
        pickupTime: pickupTime,
        pickupReqId: pickup._id,
      };
      console.log("formData", formData);

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
            showTime
            disabledDate={disablePastDates}
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
