import { useEffect, useState } from "react";
import dayjs from "dayjs";
import commercialBannerImg from "../../assets/commercial_banner_img.jpg";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import PickupCommercialFormModal from "../../components/user/PickupCommercialFormModal";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import {
  checkServiceAvailability,
  getCommercial,
} from "../../redux/slices/user/commercialSlice";

const Commercial = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [serviceQuery, setServiceQuery] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(
    null
  );

  const dispatch = useAppDispatch();
  const { user, loading, error } = useSelector(
    (state: any) => state.userCommercial
  );
  const token = localStorage.getItem("token");

  const startOfMonth = currentMonth.startOf("month");
  // const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  console.log("token", token);
  console.log("user", user);
  useEffect(() => {
    if (!token) return;

    dispatch(getCommercial(token));
  }, [token, dispatch]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //   }
  // }, [error]);

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleDateClick = (day: number) => {
    const fullDate = currentMonth.date(day).format("DD-MM-YYYY");
    setSelectedDate(fullDate);
    setIsFormOpen(true);    
  };
  const handleServiceSearch = async () => {
    if (!serviceQuery.trim()) return;

    try {
      const response = await dispatch(
        checkServiceAvailability({
          service: serviceQuery,
          wasteplantId: user?.wasteplantId,
        })
      ).unwrap();

      if (response?.available) {
        setServiceAvailable(true);
      } else {
        setServiceAvailable(false);
      }
    } catch (err) {
      console.error("Service check error", err);
      setServiceAvailable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Banner */}
      <div
        className="relative h-64 w-full"
        style={{
          backgroundImage: `url(${commercialBannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30  flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold text-center px-4">
            Commercial Trash & Recycling Pickup
          </h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-xl mx-auto mt-8 mb-4 p-4 bg-white shadow rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">
          Check Service Availability
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Enter service you want"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
          /> */}
          <select
            className="border p-2 rounded w-full"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
          >
            <option value="">Select type of waste</option>
            <option value="Medical Waste">Medical Waste</option>
            <option value="Building Waste">Building Waste</option>
            <option value="E-waste">E-waste</option>
            <option value="Plastic Waste">Plastic Waste</option>
            <option value="Food Waste">Food Waste</option>
          </select>
          <button
            onClick={handleServiceSearch}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Search
          </button>
        </div>

        {/* Message display */}
        {serviceAvailable === true && (
          <p className="text-green-600 mt-4">
            Services are available in your waste plant. Proceed to select a
            date below.
          </p>
        )}
        {serviceAvailable === false && (
          <p className="text-red-600 mt-4">
            Service not available in your wasteplant.
          </p>
        )}
      </div>

      {/* Calendar Section */}
      {serviceAvailable && (
        <div className="max-w-3xl mx-auto mt-8 mb-8 p-4 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
            >
              &larr; Prev
            </button>
            <h2 className="text-xl font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button
              onClick={handleNextMonth}
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
            >
              Next &rarr;
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-medium text-gray-600">
                {day}
              </div>
            ))}

            {Array(startDay)
              .fill(null)
              .map((_, idx) => (
                <div key={`empty-${idx}`}></div>
              ))}

            {/* {Array.from({ length: daysInMonth }, (_, i) => (
            <div
              key={i}
              className="p-2 cursor-pointer rounded hover:bg-green-100 bg-green-50"
              onClick={() => handleDateClick(i + 1)}
            >
              {i + 1}
            </div>
          ))} */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = currentMonth.date(i + 1);
              const isPastDate = date.isBefore(dayjs().startOf("day"));

              return (
                <div
                  key={i}
                  className={`p-2 rounded text-sm ${
                    isPastDate
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "cursor-pointer bg-green-50 hover:bg-green-100"
                  }`}
                  onClick={() => {
                    if (!isPastDate) handleDateClick(i + 1);
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PickupCommercialFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedDate={selectedDate}
        serviceQuery={serviceQuery}
        user={user}
      />
      <Footer />
    </div>
  );
};

export default Commercial;
