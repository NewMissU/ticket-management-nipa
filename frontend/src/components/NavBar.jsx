import reactLogo from "../assets/react.svg";
import { Link, NavLink } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeLink = ({ isActive }) =>
    isActive
      ? "bg-blue-700/60 rounded px-3 py-2"
      : "hover:bg-blue-700/20 rounded px-3 py-2";

  return (
    <>
      <header>
        <div className="flex justify-center items-center mr-auto gap-x-2 font-semibold text-md sm:text-lg md:text-md">
          <Link to="/">
            <img src={reactLogo} alt="" />
          </Link>
          <h1>IT HELPDESK : Ticket Management</h1>
        </div>
        <ul className="hidden md:flex flex-row gap-y-6 md:gap-x-6 font-medium text-sm md:text-md">
          <li>
            <NavLink to="/" className={activeLink}>
              SUBMIT A TICKET
            </NavLink>
          </li>
          <li>
            <NavLink to="/kanban" className={activeLink}>
              TICKETS BOARD
            </NavLink>
          </li>
        </ul>
        {/* Menu hamburger icon */}
        <MdMenu
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </header>

      <div
        className={`md:hidden
          font-semibold text-md ${
            isMenuOpen ? "bg-blue-500 text-white" : "hidden"
          }`}
      >
        <ul className="flex flex-col font-medium text-sm text-center">
          <li className=" p-2 hover:bg-blue-400">
            <NavLink to="/">SUBMIT A TICKET</NavLink>
          </li>
          <li className={`p-2 hover:bg-blue-400`}>
            <NavLink to="/kanban">TICKETS BOARD</NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
