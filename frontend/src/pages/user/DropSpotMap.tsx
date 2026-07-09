import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useAppDispatch } from "../../redux/hooks";
import { fetchNearDropSpots } from "../../redux/slices/user/dropSpotSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserDropSpot } from "../../types/dropspots/dropSpotTypes";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 10.8505,
  lng: 76.2711,
};

const DropSpotMap: React.FC = () => {
  const { dropSpots } = useSelector((state: RootState) => state.userDropSpot);
  const [selectedSpot, setSelectedSpot] = useState<UserDropSpot | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchDropSpots = async () => {
      try {
        console.log("Fetching...");
        const res = await dispatch(fetchNearDropSpots());
        console.log("res",res);
        
      } catch (error) {
        console.error("Error fetching drop spots", error);
      }
    };

    fetchDropSpots();
  }, [dispatch]);
  console.log("dropSpots", dropSpots);
const { isLoaded, loadError } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY!,
});

if (loadError) return <div>Error loading Google Maps</div>;
if (!isLoaded) return <div>Loading map...</div>;
  return (
    // <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
        {dropSpots.map((spot: UserDropSpot) => 
        {
        return (
          <Marker
            key={spot._id}
            position={{ lat: spot.coordinates.lat, lng: spot.coordinates.lng }}
            title={spot.dropSpotName}
            onClick={() => setSelectedSpot(spot)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )
      }
        )}
        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.coordinates.lat,
              lng: selectedSpot.coordinates.lng,
            }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div style={{ maxWidth: "200px" }}>
              <h4 style={{ margin: 0 }}>{selectedSpot.dropSpotName}</h4>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                {selectedSpot.addressLine}, {selectedSpot.location}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    // </LoadScript>
  );
};

export default DropSpotMap;
