import { useParams } from "react-router-dom";
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
import { useSocket } from "../../hooks/useSocket";

const TrackPickup = () => {
  const { pickupReqId } = useParams<{ pickupReqId: string }>();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    selectedPickup: pickup,
    loading,
    error,
  } = useSelector((state: RootState) => state.driverPickups);

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
    if (pickup?.selectedAddress && pickup._id) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
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
          const destination = `${pickup.selectedAddress.addressLine1}, ${pickup.selectedAddress.addressLine2}, ${pickup.selectedAddress.location}, ${pickup.selectedAddress.taluk}, ${pickup.selectedAddress.district}, ${pickup.selectedAddress.state}, ${pickup.selectedAddress.pincode}`;
          dispatch(
            fetchEta({
              origin,
              destination,
              pickupReqId: pickup._id,
              addressId: pickup.selectedAddress._id,
            })
          );
          // if (
          //   !pickup.selectedAddress.latitude ||
          //   !pickup.selectedAddress.longitude
          // ) {
          //   dispatch(
          //     updateAddressLatLng({
          //       addressId: pickup.selectedAddress._id,
          //       latitude,
          //       longitude,
          //     })
          //   );
          // }
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

  // useEffect(() => {
  //   let watchId: number;

  //   if (
  //     pickup &&
  //     pickup.selectedAddress?.latitude &&
  //     pickup.selectedAddress?.longitude &&
  //     pickup._id &&
  //     initialDriverLocation
  //   ) {
  //     watchId = navigator.geolocation.watchPosition(
  //       (position) => {
  //         // const { latitude, longitude } = position.coords;
  //         // setDriverLocation([latitude, longitude]);
  //         // socket?.emit("driverLocationUpdate", {
  //         //   pickupReqId: pickup._id,
  //         //   latitude,
  //         //   longitude,
  //         // });
  //         const { latitude, longitude, accuracy } = position.coords;
  //         const finalLat =
  //           accuracy > 1000 && initialDriverLocation
  //             ? initialDriverLocation[0]
  //             : latitude;
  //         const finalLng =
  //           accuracy > 1000 && initialDriverLocation
  //             ? initialDriverLocation[1]
  //             : longitude;

  //         setDriverLocation([finalLat, finalLng]);

  //         socket?.emit("driverLocationUpdate", {
  //           pickupReqId: pickup._id,
  //           latitude: finalLat,
  //           longitude: finalLng,
  //         });

  //         const pickupLat = pickup.selectedAddress.latitude;
  //         const pickupLng = pickup.selectedAddress.longitude;

  //         const distance = getDistanceFromLatLonInKm(
  //           finalLat,
  //           finalLng,
  //           pickupLat,
  //           pickupLng
  //         );

  //         let newStatus: string | null = null;
  //         if (distance < 0.2) newStatus = "Arrived";
  //         else if (distance < 1) newStatus = "Near";
  //         else newStatus = "InTransit";

  //         if (newStatus && newStatus !== pickup.trackingStatus) {
  //           dispatch(
  //             updateTrackingStatus({
  //               pickupReqId: pickup._id,
  //               trackingStatus: newStatus,
  //             })
  //           );
  //         }
  //       },
  //       (error) => {
  //         toast.error("Failed to track driver location");
  //         console.error("WatchPosition error:", error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 0,
  //         timeout: 5000,
  //       }
  //     );
  //   }

  //   return () => {
  //     if (watchId) navigator.geolocation.clearWatch(watchId);
  //   };
  // }, [pickup, dispatch, initialDriverLocation]);

  // const handleStartJourney = () => {
  //   if (!pickup?._id || !socket) return;

  //   setJourneyStarted(true);

  //   intervalRef.current = setInterval(() => {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         socket.emit("driverLocationUpdate", {
  //           pickupReqId: pickup._id,
  //           latitude,
  //           longitude,
  //         });
  //       },
  //       (err) => console.error("Location error:", err),
  //       {
  //         enableHighAccuracy: true,
  //         maximumAge: 10000,
  //         timeout: 5000,
  //       }
  //     );
  //   }, 5000);
 
  // };

  const handleStartJourney = () => {
  if (!pickup?._id || !socket) return;

  setJourneyStarted(true);


  const path: [number, number][] = [
    [10.886702, 76.039615],
    [10.887702, 76.040615],
    [10.888702, 76.041615],
    [10.889702, 76.042615],
    [10.890702, 76.043615], 
    [pickup.selectedAddress.latitude, pickup.selectedAddress.longitude], 
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

    const pickupLat = pickup.selectedAddress.latitude;
    const pickupLng = pickup.selectedAddress.longitude;
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

    //    const origin = `${lat},${lng}`;
    // const destination = `${pickup.selectedAddress.addressLine1}, ${pickup.selectedAddress.addressLine2}, ${pickup.selectedAddress.location}, ${pickup.selectedAddress.taluk}, ${pickup.selectedAddress.district}, ${pickup.selectedAddress.state}, ${pickup.selectedAddress.pincode}`;

    // dispatch(
    //   fetchEta({
    //     origin,
    //     destination,
    //     pickupReqId: pickup._id,
    //     addressId: pickup.selectedAddress._id,
    //   })
    // );

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
    !pickup.selectedAddress?.latitude ||
    !pickup.selectedAddress?.longitude
  ) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  const position: [number, number] = [
    pickup.selectedAddress.latitude,
    pickup.selectedAddress.longitude,
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
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Pickup Details
      </h2>

      <Card bordered className="shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <p>
              <strong>Pickup ID:</strong> {pickup.pickupId}
            </p>
            <p>
              <strong>User Name:</strong> {pickup.userFullName}
            </p>
            <p>
              <strong>Pickup Date:</strong>{" "}
              {pickup.originalPickupDate?.slice(0, 10)}
            </p>
            <p>
              <strong>Time:</strong> {pickup.pickupTime}
            </p>
            <p>
              <strong>Status:</strong> <Tag color="green">{pickup.status}</Tag>
            </p>
            <p>
              <strong>ETA:</strong>{" "}
              {error
                ? "Failed to fetch ETA"
                : pickup.eta?.text || "Calculating..."}
            </p>
            {/* <p><strong>Tracking:</strong> {pickup.trackingStatus}</p> */}
            <Button
              type="primary"
              onClick={handleStartJourney}
              disabled={journeyStarted}
              className="mt-3"
            >
              {journeyStarted ? "Journey Started" : "Start Pickup Journey"}
            </Button>
          </div>

          <div className="text-gray-700">
            <p>
              <strong>Address:</strong>
            </p>
            <p>{pickup.selectedAddress.addressLine1}</p>
            <p>{pickup.selectedAddress.addressLine2}</p>
            <p>
              {pickup.selectedAddress.location}, {pickup.selectedAddress.taluk}
            </p>
            <p>
              {pickup.selectedAddress.district}, {pickup.selectedAddress.state}{" "}
              - {pickup.selectedAddress.pincode}
            </p>
          </div>
        </div>
      </Card>

      <div className="h-[400px] rounded overflow-hidden shadow-md">
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
          {pickup.selectedAddress.latitude &&
            pickup.selectedAddress.longitude && (
              <Marker position={position} icon={pickupIcon}>
                <Popup>
                  Pickup Location <br /> {pickup.userFullName}
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
  );
};

export default TrackPickup;
