import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#fafcfb]">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Header */}
      <Header
        setMobileOpen={setMobileOpen}
      />

      {/* Content */}
      <main
        style={{
          marginLeft: "178px",
          width: "calc(100% - 178px)",
          paddingTop: "40px",
        }}
        className="
          ml-[178px]
          w-[calc(100%-178px)]
          pt-[40px]
          max-[900px]:ml-0
          max-[900px]:w-full
        "
      >
        <div className="w-full min-w-0">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;