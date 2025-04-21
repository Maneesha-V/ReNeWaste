import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Spin, Card, Button, Tag } from "antd";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import {
  fetchEta,
  fetchPickupById,
} from "../../redux/slices/driver/pickupDriverSlice";
import { toast } from "react-toastify";

const TrackPickup = () => {
  const { pickupReqId } = useParams<{ pickupReqId: string }>();
  const dispatch = useAppDispatch();
  const {
    selectedPickup: pickup,
    loading,
    error,
  } = useSelector((state: RootState) => state.driverPickups);

  useEffect(() => {
    if (pickupReqId) {
      dispatch(fetchPickupById(pickupReqId));
    }
  }, [dispatch, pickupReqId]);
  console.log("picj", pickup);

  useEffect(() => {
    if (pickup && pickup.selectedAddress && pickup._id) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const origin = `${latitude},${longitude}`;

          // const destination = `${pickup.selectedAddress.addressLine1}, ${pickup.selectedAddress.addressLine2}, ${pickup.selectedAddress.location}, ${pickup.selectedAddress.taluk}, ${pickup.selectedAddress.district}, ${pickup.selectedAddress.state}, ${pickup.selectedAddress.pincode}`;
          const destination = `${pickup.selectedAddress.addressLine2}, ${pickup.selectedAddress.location}, ${pickup.selectedAddress.taluk}, ${pickup.selectedAddress.district}, ${pickup.selectedAddress.state}, ${pickup.selectedAddress.pincode}`;
          dispatch(fetchEta({ origin, destination, pickupReqId: pickup._id }));
        },
        (err: any) => {
          toast.error("Geolocation error:", err);
        }
      );
    }
  }, [pickup, dispatch]);

  const getMapsUrl = (address: any) => {
    const full = `${address?.addressLine1}, ${address?.addressLine2}, ${address?.location}, ${address?.taluk}, ${address?.district}, ${address?.state}, ${address?.pincode}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      full
    )}`;
  };

  if (loading || !pickup) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Pickup Details</h2>
      <Card bordered>
        <div className="space-y-2 text-sm sm:text-base">
          <p>
            <strong>Pickup ID:</strong> {pickup?.pickupId}
          </p>
          <p>
            <strong>User Name:</strong> {pickup?.userFullName}
          </p>
          <p>
            <strong>Address:</strong>
          </p>
          <div className="pl-4 text-gray-600">
            <p>{pickup?.selectedAddress?.addressLine1}</p>
            <p>{pickup?.selectedAddress?.addressLine2}</p>
            <p>
              {pickup?.selectedAddress?.location},{" "}
              {pickup?.selectedAddress?.taluk}
            </p>
            <p>
              {pickup?.selectedAddress?.district},{" "}
              {pickup?.selectedAddress?.state} -{" "}
              {pickup?.selectedAddress?.pincode}
            </p>
          </div>
          <p>
            <strong>Pickup Date:</strong>{" "}
            {pickup?.originalPickupDate?.slice(0, 10)}
          </p>
          <p>
            <strong>Time:</strong> {pickup?.pickupTime}
          </p>
          <p>
            <strong>Status:</strong> <Tag color="green">{pickup?.status}</Tag>
          </p>
          <p>
            <strong>Estimated ETA:</strong>{" "}
            {loading
              ? "Calculating..."
              : error
              ? "Failed to fetch ETA"
              : pickup?.eta?.text}
          </p>
          <a
            href={getMapsUrl(pickup?.selectedAddress)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="primary" block>
              Open in Google Maps
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default TrackPickup;
