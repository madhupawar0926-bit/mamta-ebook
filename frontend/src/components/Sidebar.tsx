import {
  BookOpen,
  ChevronDown,
  Grid2X2,
  LogOut,
  IndianRupee,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import "./Sidebar.css";
import { UserRoundCheck } from "lucide-react";
interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function Sidebar({
  mobileOpen = false,
  onClose,
  collapsed = false,
  onCollapseToggle,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* OVERLAY */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${mobileOpen ? "sidebar-mobile-open" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}
      >

        <button
          type="button"
          className="sidebar-collapse-toggle"
          onClick={onCollapseToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src={logo} alt="Logo" />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <strong>MAMTA</strong>
              <span>E-Book Publication</span>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="sidebar-nav">

          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
            title={collapsed ? "Dashboard" : undefined}
          >
            <Grid2X2 size={17} strokeWidth={1.8} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/category"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
            title={collapsed ? "Category" : undefined}
          >
            <BookOpen size={17} strokeWidth={1.8} />
            {!collapsed && <span>Category</span>}
          </NavLink>

          <NavLink
            to="/earnings"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
            title={collapsed ? "Earnings" : undefined}
          >
            <IndianRupee size={17} strokeWidth={1.8} />
            {!collapsed && <span>Earnings</span>}
          </NavLink>
         <NavLink
  to="/securitycontrol"
  className={({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`
  }
  onClick={onClose}
  title={collapsed ? "Security Controls" : undefined}
>
  <ShieldCheck size={17} strokeWidth={1.8} />

  {!collapsed && (
    <span>Security Controls</span>
  )}
</NavLink>


<NavLink
  to="/"
  className={({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`
  }
  onClick={onClose}
  title={
    collapsed
      ? "Student Details & Purchase"
      : undefined
  }
>
  <UserRoundCheck
    size={17}
    strokeWidth={1.8}
  />

  {!collapsed && (
    <span>Student Details & Purchase</span>
  )}
</NavLink>

        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <div className="sidebar-account-box">

            <div className="sidebar-user">
              <div className="user-avatar">
                <span>AU</span>
              </div>
              {!collapsed && (
                <>
                  <div className="user-details">
                    <strong>Admin User</strong>
                    <span>Administrator</span>
                  </div>
                  <ChevronDown size={14} className="user-chevron" />
                </>
              )}
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut size={16} strokeWidth={1.8} />
              {!collapsed && <span>Logout</span>}
            </button>

          </div>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
