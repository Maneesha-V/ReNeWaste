import { FaUserCircle, FaBell, FaBars, FaCaretDown } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/user/userSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMoreOpen(false); 
  };

  const toggleMore = () => {
    setIsMoreOpen(!isMoreOpen);
    setIsMenuOpen(false); 
  };

  const handleNavigation = (path: string) => {
    navigate(path); 
    setIsMenuOpen(false);
    setIsMoreOpen(false); 
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap(); 
      navigate("/"); 
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <header className="w-full">
      {/* First Division */}
      <div className="bg-green-100 text-dark p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
        <button onClick={() => handleNavigation("/profile")}>
            <FaUserCircle className="w-8 h-8 cursor-pointer hover:text-green-600" />
          </button>
          <span className="text-xl font-bold">ReNeWaste</span>
        </div>

        <div className="flex items-center space-x-6">
          <FaBell className="w-6 h-6 cursor-pointer hover:text-green-600" />
          <div className="md:hidden relative">
            <button
              onClick={toggleMore}
              className="flex items-center space-x-2 hover:text-green-600"
            >
              <span>More</span>
              <FaCaretDown className="w-4 h-4" />
            </button>

            {/* "More" Dropdown Menu */}
            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg">
                <button
                  onClick={() => handleNavigation("/drop-spots")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                >
                  Drop Spots
                </button>
                <button
                  onClick={() => handleNavigation("/payment-history")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                >
                  Payments
                </button>
                <button
                  onClick={() => handleNavigation("/pickup-plans")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                >
                  Pickup Plan
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
                        <button
              onClick={() => handleNavigation("/drop-spots")}
              className="hover:text-green-600"
            >
              Drop Spots
            </button>
            <button
              onClick={() => handleNavigation("/pickup-plans")}
              className="hover:text-green-600"
            >
              Pickup Plan
            </button>
            <button
              onClick={() => handleNavigation("/payment-history")}
              className="hover:text-green-600"
            >
              Payments
            </button>
            <button
              onClick={handleLogout}
              className="hover:text-green-600"
            >
              Logout
            </button>
          </div>

          {/* Hamburger Menu (Visible Only on Small Screens) */}
          <div className="md:hidden">
            <FaBars
              className="w-6 h-6 cursor-pointer hover:text-green-600"
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>

      {/* Hamburger Menu Options (Visible on Small Screens) */}
      {isMenuOpen && (
        <div className="bg-gray-700 text-white p-4 md:hidden">
          <button
            onClick={() => handleNavigation("/home")}
            className="block w-full py-2 text-left hover:text-green-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/residential")}
            className="block w-full py-2 text-left hover:text-green-600"
          >
            Residential
          </button>
          <button
            onClick={() => handleNavigation("/commercial")}
            className="block w-full py-2 text-left hover:text-green-600"
          >
            Commercial
          </button>
          <button
            onClick={() => handleNavigation("/about-us")}
            className="block w-full py-2 text-left hover:text-green-600"
          >
            About Us
          </button>
        </div>
      )}

      {/* Second Division (Visible on Larger Screens) */}
      <div className="bg-white shadow-md p-4 hidden md:flex justify-center space-x-8">
        <button
          onClick={() => handleNavigation("/home")}
          className="text-gray-700 hover:text-green-600"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigation("/residential")}
          className="text-gray-700 hover:text-green-600"
        >
          Residential
        </button>
        <button
          onClick={() => handleNavigation("/commercial")}
          className="text-gray-700 hover:text-green-600"
        >
          Commercial
        </button>
        <button
          onClick={() => handleNavigation("/about-us")}
          className="text-gray-700 hover:text-green-600"
        >
          About Us
        </button>
      </div>
    </header>
  );
};

export default Header;