import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Spin, Card, Button, Tag } from "antd";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import {
  fetchEta,
  fetchPickupById,
  updateTrackingStatus,
} from "../../redux/slices/driver/pickupDriverSlice";
import { toast } from "react-toastify";
import { getDistanceFromLatLonInKm } from "../../utils/mapUtils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSafeSocket } from "../../hooks/useSocket";
import { formatDateToDDMMYYYY, formatTimeTo12Hour } from "../../utils/formatDate";

const TrackPickup = () => {
  const { pickupReqId } = useParams<{ pickupReqId: string }>();
  const dispatch = useAppDispatch();
  const socket = useSafeSocket();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const {
    selectedPickup: pickup,
    loading
  } = useSelector((state: RootState) => state.driverPickups);
  const eta = useSelector((state: RootState) => state.driverPickups.eta);
  
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(
    null
  );
  const [initialDriverLocation, setInitialDriverLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (pickupReqId) {
      dispatch(fetchPickupById(pickupReqId));
    }
  }, [dispatch, pickupReqId]);

  useEffect(() => {
    if (pickup?.userAddress && pickup._id) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log("accuracy",accuracy)
          const fallbackLat = 10.886702;
          const fallbackLng = 76.039615;
          const finalLat = accuracy > 1000 ? fallbackLat : latitude;
          const finalLng = accuracy > 1000 ? fallbackLng : longitude;
          console.log("position", {
            latitude,
            longitude,
            accuracy,
            used: [finalLat, finalLng],
          });
          setInitialDriverLocation([finalLat, finalLng]);
          const origin = `${finalLat},${finalLng}`;
          
          // const { latitude, longitude } = position.coords;
          // const origin = `${latitude},${longitude}`;
          const destination = `${pickup.userAddress.addressLine1}, ${pickup.userAddress.addressLine2}, ${pickup.userAddress.location}, ${pickup.userAddress.taluk}, ${pickup.userAddress.district}, ${pickup.userAddress.state}, ${pickup.userAddress.pincode}`;
          dispatch(
            fetchEta({
              origin,
              destination,
              pickupReqId: pickup._id,
              addressId: pickup.addressId,
            })
          );
   
        },
        (err) => {
          toast.error("Geolocation error");
          console.error(err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }
  }, [pickup, dispatch]);
  console.log("pickup", pickup);

  console.log("initialDriverLocation", initialDriverLocation);
  const handleStartJourney = () => {
  if (!pickup?._id || !socket) return;

  setJourneyStarted(true);


  const path: [number, number][] = [
    [10.886702, 76.039615],
    [10.887702, 76.040615],
    [10.888702, 76.041615],
    [10.889702, 76.042615],
    [10.890702, 76.043615], 
    [pickup.userAddress.latitude, pickup.userAddress.longitude], 
  ];


  let index = 0;

  intervalRef.current = setInterval(() => {
    if (index >= path.length) {
      clearInterval(intervalRef.current!);
      return;
    }

    const [lat, lng] = path[index];
    setDriverLocation([lat, lng]);

    socket?.emit("driverLocationUpdate", {
      pickupReqId: pickup._id,
      latitude: lat,
      longitude: lng,
    });

    const pickupLat = pickup.userAddress.latitude;
    const pickupLng = pickup.userAddress.longitude;
    console.log({lat, lng, pickupLat, pickupLng});
    
    const distance = getDistanceFromLatLonInKm(lat, lng, pickupLat, pickupLng);
    console.log("distance",distance);
    
    let newStatus: string | null = null;

 if (index === path.length - 1 && distance < 0.05) {
      newStatus = "Completed";
      clearInterval(intervalRef.current!); 
    } else if (distance < 0.2) {
      newStatus = "Arrived";
    } else if (distance < 1) {
      newStatus = "Near";
    } else {
      newStatus = "InTransit";
    }


    if (newStatus && newStatus !== pickup.trackingStatus) {
      dispatch(
        updateTrackingStatus({
          pickupReqId: pickup._id,
          trackingStatus: newStatus,
        })
      );

    }
if (newStatus === "Completed") {
  socket.emit("pickupCompleted", {
    pickupReqId: pickup._id,
    message: "Journey completed",
  });
}
    index++;
  }, 2000); 
};

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (
    loading ||
    !pickup ||
    !pickup.userAddress?.latitude ||
    !pickup.userAddress?.longitude
  ) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  const position: [number, number] = [
    pickup.userAddress.latitude,
    pickup.userAddress.longitude,
  ];

  const pickupIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const driverIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pickup Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
      <Card bordered className="shadow-md w-full h-full p-4">
  <div className="space-y-2 text-sm sm:text-base">

    <p><strong>Pickup ID:</strong> {pickup.pickupId}</p>
    <p><strong>User Name:</strong> {pickup.userName}</p>
    <p><strong>Pickup Date:</strong> {pickup.originalPickupDate ? formatDateToDDMMYYYY(pickup.originalPickupDate): ""}</p>
    <p><strong>Time:</strong> {pickup.pickupTime ? formatTimeTo12Hour(pickup.pickupTime) : ""}</p>

    <p>
      <strong>Status:</strong>
      <Tag color="green" className="ml-2">{pickup.status}</Tag>
    </p>
    <p>
      <strong>ETA:</strong> 
      {eta?.duration?.text || pickup?.eta?.text || "Calculating..."}
    </p>

{/* <hr className="my-2" /> */}

    {/* Address Section */}
    <div className="space-y-1">
      <p><strong>Address:</strong></p>
      <p>{pickup.userAddress.addressLine1}</p>
      <p>{pickup.userAddress.addressLine2}</p>
      <p>{pickup.userAddress.location}, {pickup.userAddress.taluk}</p>
      <p>{pickup.userAddress.district}, {pickup.userAddress.state} - {pickup.userAddress.pincode}</p>
    </div>
    <p><strong>Tracking:</strong> {pickup.trackingStatus}</p>
    <Button
      type="primary"
      onClick={handleStartJourney}
      disabled={pickup.trackingStatus === "Completed" || journeyStarted}
      className="mt-4 w-full"
    >
      {journeyStarted ? "Journey Started" : "Start Pickup Journey"}
    </Button>
    <Button
    type="primary"
  onClick={() => navigate("/driver/alloted-pickups")}
  className="mt-2 w-full bg-primary"
>
  Go Back
</Button>
    
  </div>
</Card>

      <div className="h-[500px] rounded overflow-hidden shadow-md">
        <MapContainer
          center={driverLocation ?? position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Pickup Location Marker */}
          {pickup.userAddress.latitude &&
            pickup.userAddress.longitude && (
              <Marker position={position} icon={pickupIcon}>
                <Popup>
                  Pickup Location <br /> {pickup.userName}
                </Popup>
              </Marker>
            )}

          {/* Driver Location Marker */}
          {driverLocation && (
            <Marker position={driverLocation} icon={driverIcon}>
              <Popup>Driver Current Location</Popup>
            </Marker>
          )}

        </MapContainer>
      </div>
    </div>
    </div>
  );
};

export default TrackPickup;
