import {
  Menu,
  Search,
  Bell,
  ChevronDown,
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

    if (location.pathname.startsWith("/books/add")) {
      return "Add New Book";
    }

    if (location.pathname.startsWith("/books/folder/add")) {
      return "Add New Folder";
    }

    if (location.pathname.startsWith("/books")) {
      return "Books";
    }

    if (location.pathname.startsWith("/earnings")) {
      return "Earnings";
    }

    return "Dashboard";
  };

  return (
    <header className="app-header">

      <div className="header-left">

        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={24} />
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


        <div className="header-user">

          <div className="header-avatar">
            AU
          </div>

          <div className="header-user-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}

export default Header;