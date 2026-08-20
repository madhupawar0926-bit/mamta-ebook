import {
  BookOpen,
  ChevronDown,
  Grid2X2,
  LogOut,
  IndianRupee,
} from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login data
    localStorage.clear();
    sessionStorage.clear();

    // Close mobile sidebar
    onClose?.();

    // Go to login page
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ================= OVERLAY ================= */}

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >

        {/* ================= BRAND ================= */}

        <div className="sidebar-brand">

         <div className="brand-logo">
  <img src={logo} alt="Logo" />
</div>

          <div className="brand-text">
            <strong>MAMTA</strong>

            <span>
              E-Book Publication
            </span>
          </div>

        </div>


        {/* ================= MENU ================= */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
            onClick={onClose}
          >
            <Grid2X2
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Dashboard
            </span>
          </NavLink>


          {/* BOOKS */}

          <NavLink
            to="/books"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
            onClick={onClose}
          >
            <BookOpen
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Category
            </span>
          </NavLink>


          {/* EARNINGS */}

          <NavLink
            to="/earnings"
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "active" : ""
              }`
            }
            onClick={onClose}
          >
            <IndianRupee
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Earnings
            </span>
          </NavLink>

        </nav>


        {/* ================= BOTTOM ================= */}

        <div className="sidebar-bottom">

          {/* SINGLE ACCOUNT BOX */}

          <div className="sidebar-account-box">

            {/* USER */}

            <div className="sidebar-user">

              <div className="user-avatar">
                <span>
                  AU
                </span>
              </div>

              <div className="user-details">

                <strong>
                  Admin User
                </strong>

                <span>
                  Administrator
                </span>

              </div>

              <ChevronDown
                size={14}
                className="user-chevron"
              />

            </div>


            {/* LOGOUT */}

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut
                size={16}
                strokeWidth={1.8}
              />

              <span>
                Logout
              </span>
            </button>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;