import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRecycle, FaBars, FaTimes } from "react-icons/fa";

const LandingHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "How it Works", id: "how-it-works" },
    { label: "Services", id: "services" },
    { label: "Contact", id: "contact" },
  ];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-6">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <FaRecycle className="text-3xl text-green-600" />

            <span className="text-2xl font-bold text-green-700">
              ReNeWaste
            </span>
          </button>

          {/* Desktop Menu */}

          <nav className="hidden md:flex items-center gap-8">

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                {item.label}
              </button>
            ))}

          </nav>

          {/* Desktop Buttons */}

          <div className="hidden md:flex items-center gap-4">

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Sign Up
            </button>

          </div>

          {/* Mobile Menu Icon */}

          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div className="md:hidden bg-white border-t">

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left px-6 py-4 hover:bg-green-50"
            >
              {item.label}
            </button>
          ))}

          <div className="px-6 py-4 space-y-3">

            <button
              onClick={() => navigate("/login")}
              className="w-full border border-green-600 text-green-600 py-3 rounded-lg"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Sign Up
            </button>

          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;