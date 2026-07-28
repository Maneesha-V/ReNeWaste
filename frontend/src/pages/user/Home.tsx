import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import homeBannerImg from "../../assets/home_banner_img.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* --- Banner 1 --- */}
      <section className="relative bg-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Waste Management Services
          </h1>
          <p className="text-lg md:text-xl">
            Efficient & Responsible Waste Disposal Solutions
          </p>
        </div>

        {/* Image below banner */}
        <div className="mt-10 relative flex justify-center">
          <img
            src={homeBannerImg}
            alt="Waste Management"
            className="rounded-lg shadow-lg w-full max-w-4xl"
          />
        </div>

        {/* Services Below Banner */}
        <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center gap-6 bg-black/30 rounded-lg">
          <button
            onClick={() => navigate("/residential")}
            className="bg-white/90 cursor-pointer text-gray-800 p-6 rounded-xl shadow-md w-60 text-center transition
            duration-300 hover:bg-green-600 hover:text-white"
          >
            <h3 className="text-xl font-semibold mb-2">Residential Services</h3>
            <ul className="list-disc list-inside text-sm text-left">
              <li>Hassle-free doorstep waste collection</li>
              <li>Eco-friendly recycling solutions</li>
              <li>Safe and timely waste disposal</li>
              <li>Keeping your neighborhood clean</li>
            </ul>
          </button>

          <button
            onClick={() => navigate("/commercial")}
            className="bg-white/90 cursor-pointer text-gray-800 p-6 rounded-xl shadow-md w-60 text-center transition
            duration-300 hover:bg-green-600 hover:text-white"
          >
            <h3 className="text-xl font-semibold mb-2">Commercial Services</h3>
            <ul className="list-disc list-inside text-sm text-left">
              <li>Scalable solutions for all business sizes</li>
              <li>Customized pickup schedules</li>
              <li>Industry-compliant waste management</li>
              <li>Reliable service for offices & industries</li>
            </ul>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
