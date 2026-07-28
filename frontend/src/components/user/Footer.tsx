// import {
//     FaFacebook,
//     FaTwitter,
//     FaInstagram,
//     FaHome,
//     FaInfoCircle,
//     FaEnvelope,
//     FaPhone,
//     FaMapMarkerAlt,
//   } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import UserRating from "../common/UserRating";

//   const Footer = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");
//     const isLoggedIn = !!token;
//     const handleNavigation = (path: string) => {
//       navigate(path);
//     };

//     return (
//       <footer className="w-full">
//          {/* ⭐ User Rating Section */}
//          {isLoggedIn &&
//             <UserRating />
//          }

//         <div className="bg-green-700 text-white py-8">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {/* Quick Links */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Quick Links</h3>
//                 <ul className="space-y-2">
//                   <li>
//                     <button
//                       onClick={() => handleNavigation("/home")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaHome className="mr-2" /> Home
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => handleNavigation("/about-us")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaInfoCircle className="mr-2" /> About Us
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => handleNavigation("/contact")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaEnvelope className="mr-2" /> Contact
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               {/* Contact Information */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Contact Us</h3>
//                 <ul className="space-y-2">
//                   <li className="flex items-center">
//                     <FaEnvelope className="mr-2" /> Email: info@renewaste.com
//                   </li>
//                   <li className="flex items-center">
//                     <FaPhone className="mr-2" /> Phone: +1 234 567 890
//                   </li>
//                   <li className="flex items-center">
//                     <FaMapMarkerAlt className="mr-2" /> Address: 123 Green St, Eco City
//                   </li>
//                 </ul>
//               </div>

//               {/* Social Media Links */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Follow Us</h3>
//                 <ul className="space-y-2">
//                   <li>
//                     <button
//                       onClick={() => window.open("https://facebook.com", "_blank")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaFacebook className="mr-2" /> Facebook
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => window.open("https://twitter.com", "_blank")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaTwitter className="mr-2" /> Twitter
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => window.open("https://instagram.com", "_blank")}
//                       className="flex items-center hover:text-gray-300"
//                     >
//                       <FaInstagram className="mr-2" /> Instagram
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-green-100 text-dark py-4">
//           <div className="container mx-auto px-4 text-center">
//             <p className="text-sm">
//               &copy; {new Date().getFullYear()} ReNeWaste. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     );
//   };

//   export default Footer;

import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import UserRating from "../common/UserRating";

const Footer = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <footer className="w-full">
      {/* Rating Section (Only after Login) */}
      {isLoggedIn && <UserRating />}

      {/* Footer */}
      <div className="bg-green-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Side */}
            <div>
              <h2 className="text-3xl font-bold mb-4">ReNeWaste</h2>

              <p className="text-green-100 leading-7 max-w-lg">
                ReNeWaste simplifies doorstep waste collection by connecting
                users with nearby waste collection services. Schedule pickups
                easily and help keep your community clean.
              </p>
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              <h3 className="text-xl font-semibold">Contact Information</h3>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-300" />
                <span>support@renewaste.com</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-green-300" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-300 mt-1" />
                <span>Kerala, India</span>
              </div>
            </div>
          </div>

          <div className="border-t border-green-700 mt-10 pt-6 text-center text-green-200 text-sm">
            © {new Date().getFullYear()} ReNeWaste. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
