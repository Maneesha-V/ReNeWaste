import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaTruck } from "react-icons/fa";
import Header from "../../components/user/LandingHeader";
import Footer from "../../components/user/Footer";
import homeBannerImg from "../../assets/home_banner_img.jpg";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  checkCurrentLocation,
  checkServiceAvailability,
  clearSuggestions,
  searchLocation,
} from "../../redux/slices/user/userLandingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LocationSuggestion } from "../../types/common/commonTypes";
import { toast } from "react-toastify";
import _ from "lodash";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const { suggestions, success, hasCheckedService, plantName, error } = useSelector(
    (state: RootState) => state.userLanding,
  );

  const dispatch = useAppDispatch();
  const debouncedSearch = useMemo(
    () =>
      _.debounce((value: string) => {
        dispatch(searchLocation(value));
      }, 500),
    [dispatch],
  );

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearch(value);

    if (value.length < 3) {
      dispatch(clearSuggestions());
      debouncedSearch.cancel();
      return;
    }
    debouncedSearch(value);
  };
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleSelect = (item: LocationSuggestion) => {
    setSelectedLocation(item);

    setSearch(item.description);
    dispatch(clearSuggestions());
  };
  const handleCheckService = async () => {
    if (!selectedLocation) return;
    try {
    const result = await dispatch(
      checkServiceAvailability(selectedLocation.description),
    ).unwrap();
    if (result.serviceAvailable) {
      localStorage.setItem(
        "serviceLocation",
        JSON.stringify({
          location: result.location,
          wasteplantId: result.plantId,
          taluk: result.taluk,
          district: result.district,
          state: result.state,
          pincode: result.pincode,
        }),
      );
    }
  } catch(error) {
    toast.error(getAxiosErrorMessage(error))
  }
  };
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }
    setIsFetchingLocation(true);
    setSearch("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        try {
          const result = await dispatch(
            checkCurrentLocation({
              latitude,
              longitude,
            }),
          ).unwrap();
          const address = `${result.location},${result.district}`;
          setSearch(address || "");

          if (result.serviceAvailable) {
            localStorage.setItem(
              "serviceLocation",
              JSON.stringify({
                location: result.location,
                wasteplantId: result.plantId,
                taluk: result.taluk,
                district: result.district,
                state: result.state,
                pincode: result.pincode,
              }),
            );
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        console.log(error);
        toast.error("Unable to access your location.");
      },
    );
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-r from-green-700 to-green-500 text-white"
      >
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Smart Waste Collection
            </h1>

            <p className="mt-5 text-lg text-green-100">
              Schedule doorstep waste pickup quickly and responsibly. Check
              whether our service is available in your area before booking a
              pickup.
            </p>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 mt-8 shadow-lg">
              <div className="mt-3 relative">
                <div className="flex">
                  <input
                    value={search}
                    onChange={handleSearch}
                    type="text"
                    placeholder={
                      isFetchingLocation
                        ? "Fetching location..."
                        : "Search your location..."
                    }
                    className="flex-1 border rounded-l-lg px-4 py-3 text-gray-700 outline-none"
                  />

                  <button className="bg-green-600 px-5 rounded-r-lg text-white hover:bg-green-700">
                    <FaSearch />
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {suggestions.map((item: any) => (
                      <div
                        key={item.placeId}
                        onClick={() => handleSelect(item)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                      >
                        📍 {item.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleCurrentLocation}
                className="w-full mt-4 border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
              >
                <FaMapMarkerAlt className="inline mr-2" />
                {isFetchingLocation
                  ? "Fetching Location..."
                  : "Use Current Location"}
              </button>

              <button
                onClick={handleCheckService}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Check Service Availability
              </button>

              {hasCheckedService &&
                (success ? (
                  <div className="mt-4 bg-green-100 border border-green-500 text-green-700 rounded-lg p-3">
                    ✅ Service is available in your area.
                    <br />
                    <span className="font-semibold">
                      Waste Plant available in this area: {plantName}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 bg-red-100 border border-red-500 text-red-700 rounded-lg p-3">
                    ❌ {error || "Sorry, waste collection service is not available in your area."}
                  </div>
                ))}
            </div>
          </div>

          {/* Right Image */}
          <div>
            <img
              src={homeBannerImg}
              alt="Waste Collection"
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center shadow-lg rounded-xl p-6">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="font-bold text-xl">Search Location</h3>

              <p className="text-gray-600 mt-2">
                Enter your location to check whether our service is available.
              </p>
            </div>

            <div className="text-center shadow-lg rounded-xl p-6">
              <div className="text-5xl mb-4">✅</div>

              <h3 className="font-bold text-xl">Check Availability</h3>

              <p className="text-gray-600 mt-2">
                We verify whether a waste plant serves your location.
              </p>
            </div>

            <div className="text-center shadow-lg rounded-xl p-6">
              <div className="text-5xl mb-4">📅</div>

              <h3 className="font-bold text-xl">Schedule Pickup</h3>

              <p className="text-gray-600 mt-2">
                Select your preferred pickup date and time.
              </p>
            </div>

            <div className="text-center shadow-lg rounded-xl p-6">
              <div className="text-5xl mb-4">
                <FaTruck className="mx-auto text-green-600 text-5xl" />
              </div>

              <h3 className="font-bold text-xl">Waste Collected</h3>

              <p className="text-gray-600 mt-2">
                Our collection team picks up your waste on the scheduled date
                and delivers it to the assigned waste plant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}

      <section id="services" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">
            Waste Collection Services
          </h2>

          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
            ReNeWaste provides reliable doorstep waste collection services for
            households and businesses. Schedule pickups easily and help create a
            cleaner environment.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Residential */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                🏠 Residential Waste Collection
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li>✔ Doorstep household waste collection</li>
                <li>✔ Flexible pickup scheduling</li>
                <li>✔ Safe and timely waste collection</li>
                <li>✔ Assigned waste plant based on your service area</li>
              </ul>

              <button
                onClick={() => { 
                  localStorage.setItem("redirectAfterLogin","/residential")
                  navigate("/login")
                }}
                className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Schedule Residential Pickup
              </button>
            </div>

            {/* Commercial */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                🏢 Commercial Waste Collection
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li>✔ Waste collection for offices and businesses</li>
                <li>✔ Daily, weekly, or monthly pickup plans</li>
                <li>✔ Reliable scheduled collections</li>
                <li>✔ Efficient handling of commercial waste</li>
              </ul>

              <button
                onClick={() => {
                  localStorage.setItem("redirectAfterLogin","/commercial")
                  navigate("/login")
                }}
                className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Schedule Commercial Pickup
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Stats */}

      {/* <section className="bg-green-700 text-white py-16">

        <div className="container mx-auto px-6">

          <div className="grid md:grid-cols-4 text-center gap-10">

            <div>
              <h2 className="text-4xl font-bold">1000+</h2>
              <p>Pickups Completed</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">500+</h2>
              <p>Happy Users</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">20+</h2>
              <p>Partner Waste Plants</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">95%</h2>
              <p>Waste Recycled</p>
            </div>

          </div>

        </div>

      </section> */}
      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default LandingPage;
