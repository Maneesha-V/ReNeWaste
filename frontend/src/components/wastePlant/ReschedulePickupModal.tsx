import { Modal, DatePicker, Select, Form, Input } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { disablePastDates, formatDateToDDMMYYYY, formatTimeTo12Hour } from "../../utils/formatDate";
import { toast } from "react-toastify";
import {
  fetchDriversByPlace,
  reschedulePickup,
} from "../../redux/slices/wastePlant/wastePlantPickupSlice";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { DriverDTO } from "../../types/driver/driverTypes";
import { ReschedulePickupModalProps } from "../../types/common/modalTypes";

const ReschedulePickupModal = ({
  visible,
  onClose,
  pickup,
  onSubmit,
}: ReschedulePickupModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { drivers } = useSelector((state: RootState) => state.wastePlantPickup);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverDTO[]>([]);

  useEffect(() => {
    if (pickup && visible) {

      const currentValue = form.getFieldValue("pickupDate");
      if (!currentValue) {
        form.setFieldsValue({
          pickupDate: dayjs(pickup.originalPickupDate),
        });
      }
    }
  }, [pickup, visible, form]);
  useEffect(() => {
    if (visible && pickup) {
      dispatch(fetchDriversByPlace(pickup?.location));
    }
  }, [visible, pickup, pickup?.location, dispatch]);

  useEffect(() => { 
    setFilteredDrivers(drivers ?? []);
  }, [drivers]);

  console.log("filteredDrivers", filteredDrivers);
  console.log("pickup:", pickup);
  const pickupDateToShow = pickup?.rescheduledPickupDate || pickup?.originalPickupDate;

  const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ assignedZone: value });
    if (!pickup?.wasteType) return;
    const filtered = Array.isArray(drivers) ? drivers.filter(
      (d: DriverDTO) => 
        d.assignedZone?.toLowerCase() === value.toLowerCase() &&
        d.category?.toLowerCase() === pickup.wasteType?.toLowerCase()
    )
    : [];
    setFilteredDrivers(filtered);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const selectedDateTime = dayjs(values.pickupDate);
      const now = dayjs();

      if (selectedDateTime.isBefore(now)) {
        toast.error("Please select a future date and time");
        return;
      }

      if (selectedDateTime.isSame(now, "day")) {
        if (now.hour() >= 17) {
          toast.error(
            "No available time left today, please select a future date"
          );
          return;
        }
      }

      const hour = selectedDateTime.hour();
      const minute = selectedDateTime.minute();

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
      console.log("date", selectedDateTime.toISOString());

      const res = await dispatch(reschedulePickup(formData)).unwrap();
      toast.success(res?.message);
      onSubmit(formData);
      onClose();
      form.resetFields();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
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
           {pickupDateToShow ? formatDateToDDMMYYYY(pickupDateToShow) : "Not available"}
        </p>
        <p>
          <strong>Pickup Time:</strong>{" "}
          {pickup?.pickupTime ? formatTimeTo12Hour(pickup.pickupTime): "Not available"}
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
            {filteredDrivers.map((d: DriverDTO) => (
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
