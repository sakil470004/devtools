// src/components/Navbar.jsx
import { FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-base-200 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaTools className="mr-2" /> DevTools
        </Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <Link to="/contributors" className="hover:text-primary">
            Contributors
          </Link>
          <Link to="/contact" className="hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
