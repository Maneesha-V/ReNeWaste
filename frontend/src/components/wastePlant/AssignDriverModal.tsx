import { Modal, Select, Form, Button } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  approvePickup,
  fetchDriversByPlace,
} from "../../redux/slices/wastePlant/wastePlantPickupSlice";
import { fetchAvailableTrucks } from "../../redux/slices/wastePlant/wastePlantTruckSlice";
import { toast } from "react-toastify";
import {
  formatDateToDDMMYYYY,
  formatTimeTo12Hour,
} from "../../utils/formatDate";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { DriverDTO } from "../../types/driver/driverTypes";
import { TruckDTO } from "../../types/truck/truckTypes";

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
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const { driver } = useSelector((state: RootState) => state.wastePlantPickup);
  const { trucks } = useSelector((state: RootState) => state.wastePlantTruck);
  const [form] = Form.useForm();

  // const token = localStorage.getItem("token");
  console.log("selectedDriver",selectedDriver);

  console.log("trucks", trucks);
  console.log("drivers", driver);
  console.log("pickup", pickup);
  useEffect(() => {

    if (visible && pickup?.wasteplantId) {
      dispatch(fetchDriversByPlace(pickup?.location));
    }
  }, [visible, pickup?.wasteplantId, pickup?.location, dispatch]);

  useEffect(() => {
    if (trucks.length === 1) {
      form.setFieldValue("trucks", trucks[0]._id);
    }
  }, [trucks, form]);

  const filteredDrivers = Array.isArray(driver)
    ? driver.filter((d: DriverDTO) => {
        return (
          d.assignedZone === pickup?.location &&
          d.category?.toLowerCase() === pickup?.wasteType?.toLowerCase()
        );
      })
    : [];
  console.log("filteredDrivers", filteredDrivers);
  const filteredTrucks = Array.isArray(trucks)
    ? trucks.filter((t: TruckDTO) => {
        if (pickup?.wasteType?.toLowerCase() === "residential") {
          return t.capacity < 5000;
        } else if (pickup?.wasteType?.toLowerCase() === "commercial") {
          return t.capacity >= 5000;
        }
        return false;
      })
    : [];
  console.log("filteredTrucks", filteredTrucks);
  const handleAssign = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(
        approvePickup({
          pickupReqId: pickup._id,
          pickupId: pickup.pickupId,
          status: "Scheduled",
          driverId: values.driver,
          assignedTruckId: values.truck,
        })
      ).unwrap();
      console.log("result",result);

      toast.success(result?.message);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
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
              formatDateToDDMMYYYY(pickup.originalPickupDate)}
          </p>
          <p>
            <strong>Pickup Time:</strong>{" "}
            {pickup?.pickupTime && formatTimeTo12Hour(pickup.pickupTime)}
          </p>
        </div>

        <div>
          <p>
            <strong>Address:</strong>
          </p>
          {pickup?.userAddress && (
            <div className="text-sm text-gray-700 leading-relaxed ml-2">
              <p>{pickup.userAddress.addressLine1}</p>
              <p>{pickup.userAddress.addressLine2}</p>
              {/* <p>{pickup.userAddress.location}</p> */}
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
          <Select
            placeholder="Select Driver"
            onChange={(value) => {
              form.setFieldValue("driver", value);
              setSelectedDriver(value);
              dispatch(fetchAvailableTrucks(value));
            }}
          >
            {filteredDrivers.map((driver: any) => (
              <Select.Option key={driver._id} value={driver._id}>
                {driver.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Assign Truck"
          name="truck"
          rules={[{ required: true, message: "Please select a truck" }]}
        >
          <Select placeholder="Select Truck">
            {filteredTrucks.map((truck: any) => (
              <Select.Option key={truck._id} value={truck._id}>
                {truck.name}
              </Select.Option>
            ))}
          </Select>
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
