import {
  Menu,
  Search,
  Bell,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import "./Header.css";

interface HeaderProps {
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {

  const location = useLocation();

  const getTitle = () => {

    if (location.pathname === "/") {
      return "Dashboard";
    }

    if (location.pathname.startsWith("/category/add")) {
      return "Add New Book";
    }

    if (location.pathname.startsWith("/category/folder/add")) {
      return "Add New Folder";
    }

    if (location.pathname.startsWith("/category")) {
      return "Books";
    }

    if (location.pathname.startsWith("/earnings")) {
      return "Earnings";
    }
 if (location.pathname.startsWith("/securitycontrol")) {
      return "Security Controls";
    }
    return "Dashboard";
  };

  return (
    <header className="app-header">

      <div className="header-left">

        {/* MOBILE hamburger */}
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <h1>{getTitle()}</h1>

      </div>


      <div className="header-right">

        <div className="header-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search books, users, orders..."
          />

        </div>


        <button className="notification-button">

          <Bell size={20} />

          <span className="notification-badge">
            6
          </span>

        </button>


        {/* <div className="header-user">

          <div className="header-avatar">
            AU
          </div>

          <div className="header-user-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={16} />

        </div> */}

      </div>

    </header>
  );
}

export default Header;