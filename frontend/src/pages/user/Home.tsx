import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import homeBannerImg from "../../assets/home_banner_img.jpg";
import sustainableImg from "../../assets/sustainable_img.jpg";
import chooseUsImg from "../../assets/choose_us_img.jpg";
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
          <div
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
          </div>

          <div
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
          </div>
        </div>
      </section>

      {/* --- Banner 2 --- */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          {/* Image Left */}
          <div className="md:w-1/2">
            <img
              src={sustainableImg}
              alt="Sustainability"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Content Right */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Sustainable Solutions
            </h2>
            <p className="text-gray-600 mb-6">
              We are committed to eco-friendly practices and reducing landfill
              waste. Our mission is to promote responsible waste disposal while
              contributing to a cleaner and greener environment.
            </p>

            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Reducing carbon footprint through optimized routes</li>
              <li>Recycling and reusing wherever possible</li>
              <li>Partnering with certified recycling facilities</li>
              <li>Educating communities on sustainable waste management</li>
            </ul>

            <button className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* --- Banner 3 --- */}

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Content Left */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Why Choose Us
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Waste Management Services, we go beyond simple waste
              collection. We provide tailored solutions that fit your needs and
              promote a cleaner planet.
            </p>

            <ul className="space-y-4 text-gray-700 text-left">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✅</span>
                <span>Fast & Reliable Pickup Scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✅</span>
                <span>Experienced & Certified Waste Management Experts</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✅</span>
                <span>24/7 Dedicated Customer Support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✅</span>
                <span>Affordable & Flexible Subscription Plans</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✅</span>
                <span>Eco-Friendly Processing & Recycling Facilities</span>
              </li>
            </ul>

            <button className="mt-8 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
              Get Started
            </button>
          </div>

          {/* Image Right */}
          <div className="md:w-1/2">
            <img
              src={chooseUsImg}
              alt="Why Choose Us"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
