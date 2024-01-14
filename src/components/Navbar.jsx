import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/index.css";
import {
  AiFillHome,
  AiFillFileText,
  AiFillCalculator,
  AiFillMessage,
} from "react-icons/ai";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { BsPersonFillAdd } from "react-icons/bs";
import Logo from ".././assets/img/logo_puskesmas.png";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout?",
      text: "Apakah anda yakin akan logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevIsMobileMenuOpen) => !prevIsMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 py-2 bg-white shadow-md`}>
      <div className="flex justify-between items-center xl:max-w-7xl xl:mx-auto max-w-full flex-wrap px-4">
        <NavLink to="/home" className="cursor-pointer">
          <img src={Logo} alt="Logo" className="sm:w-12 w-12" />
        </NavLink>
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="block text-white focus:outline-none"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6h16v1H4V6zm0 6h16v1H4v1zm16 4H4v1h16v-1z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 5h16v1H4V5zm0 6h16v1H4v-1zm0 6h16v1H4v-1z"
                />
              )}
            </svg>
          </button>
        </div>
        <div>
          <nav
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:flex lg:items-center lg:w-auto w-full`}
          >
            <ul className="text-base text-gray-500 flex flex-col lg:flex-row items-center lg:justify-end lg:gap-8 space-x-3">
              <li
                className={`hover:text-teal-400 font-semibold text-md text-grey-500`}
              >
                <button className="flex gap-2 items-center">
                  <AiFillHome className="menu text-lg" />
                  <NavLink to="/">Home</NavLink>
                </button>
              </li>
              <li className={`hover:text-teal-400 font-semibold text-md`}>
                <button className="flex items-center gap-2">
                  <AiFillFileText className="menu text-lg" />
                  <NavLink to="/article">Artikel</NavLink>
                </button>
              </li>
              <li className={`hover:text-teal-400 font-semibold text-md`}>
                <button className="flex items-center gap-2">
                  <AiFillCalculator className="menu text-lg" />
                  <NavLink to="/bmi">Status Gizi</NavLink>
                </button>
              </li>
              <li className={`hover:text-teal-400 font-semibold text-md`}>
                <button className="flex items-center gap-2">
                  <AiFillMessage className="text-lg" />
                  <NavLink to="/forum">Forum Diskusi</NavLink>
                </button>
              </li>
              <li className={`hover:text-teal-400 font-semibold text-md`}>
                <button className="flex items-center gap-2">
                  <BsPersonFillAdd className="text-lg" />
                  <NavLink to="/consult">Konsultasi</NavLink>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <div className="lg:px-4 py-2 hover:text-blue-500 font-semibold text-lg lg:pl-6">
            {currentUser && (
              <div
                className="flex items-center cursor-pointer hover:text-primary gap-2"
                onClick={toggleDropdown}
              >
                <img
                  src={currentUser.profile}
                  alt={`Profile${currentUser.id}`}
                  className="w-6 rounded-full"
                />
                <span
                  className={`hover:text-teal-400 text-gray-500 font-semibold text-md`}
                >
                  {currentUser.username}
                </span>
              </div>
            )}
            {showDropdown && currentUser && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg mt-2 py-2 shadow-lg transition-all duration-300">
                <li>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profil
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
            {!currentUser && (
              <div className="flex lg:px-4 py-2 hover:text-blue-500 font-semibold text-lg lg:pl-6">
                <NavLink
                  to="/login"
                  className="bg-primary text-white rounded-full py-1 px-4 font-medium text-md ml-2 flex justify-center items-center transition duration-300 ease-in-out"
                  style={{ backgroundColor: "#15acb1" }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#1f6d79";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#15acb1";
                  }}
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
