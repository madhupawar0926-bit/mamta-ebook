import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar"
import Header from "./Header";

import "./Layout.css";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="app-main">

        <Header
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}