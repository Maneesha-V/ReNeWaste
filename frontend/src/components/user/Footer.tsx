import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaHome,
    FaInfoCircle,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserRating from "../common/UserRating";
  
  const Footer = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
      navigate(path);
    };
  
    return (
      <footer className="w-full">
         {/* ⭐ User Rating Section */}
        <UserRating />
        <div className="bg-green-700 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleNavigation("/home")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaHome className="mr-2" /> Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/about-us")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaInfoCircle className="mr-2" /> About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/contact")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaEnvelope className="mr-2" /> Contact
                    </button>
                  </li>
                </ul>
              </div>
  
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaEnvelope className="mr-2" /> Email: info@renewaste.com
                  </li>
                  <li className="flex items-center">
                    <FaPhone className="mr-2" /> Phone: +1 234 567 890
                  </li>
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address: 123 Green St, Eco City
                  </li>
                </ul>
              </div>
  
              {/* Social Media Links */}
              <div>
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => window.open("https://facebook.com", "_blank")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaFacebook className="mr-2" /> Facebook
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => window.open("https://twitter.com", "_blank")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaTwitter className="mr-2" /> Twitter
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => window.open("https://instagram.com", "_blank")}
                      className="flex items-center hover:text-gray-300"
                    >
                      <FaInstagram className="mr-2" /> Instagram
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-100 text-dark py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} ReNeWaste. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;