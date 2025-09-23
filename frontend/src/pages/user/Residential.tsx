import { useEffect, useState } from "react";
import dayjs from "dayjs";
import residentialBannerImg from "../../assets/residential_banner_img.jpg";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import PickupResidentialFormModal from "../../components/user/PickupResidentialFormModal";
import { getResidential } from "../../redux/slices/user/residentialSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Residential = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useSelector(
    (state: RootState) => state.userResidential
  );
  
  const startOfMonth = currentMonth.startOf("month");
  // const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  useEffect(() => {
    dispatch(getResidential());
  }, [dispatch]);
  

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleDateClick = (day: number) => {
    const fullDate = currentMonth.date(day).format("MM-DD-YYYY");
    setSelectedDate(fullDate);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Banner */}
      <div
        className="relative h-64 w-full"
        style={{
          backgroundImage: `url(${residentialBannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30  flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold text-center px-4">
            Residential Trash & Recycling Pickup
          </h1>
        </div>
      </div>

      {/* Calendar Section */}
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

          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = currentMonth.date(i + 1);
            const isPastDate = date.isBefore(dayjs().startOf("day"));

            return (
              <button
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
              </button>
            );
          })}
        </div>
      </div>

      <PickupResidentialFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedDate={selectedDate}
        user={user}
      />
      <Footer />
    </div>
  );
};

export default Residential;
