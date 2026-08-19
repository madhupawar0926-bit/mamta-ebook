import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  IndianRupee,
  MoreVertical,
  ChevronDown,
  LogOut,
  ChevronUp,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            min-[901px]:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-[178px]
          overflow-hidden
          bg-gradient-to-b
          from-[#006c51]
          via-[#00634d]
          to-[#005842]
          text-white
          transition-transform
          duration-300
          max-[900px]:w-[250px]
          ${
            mobileOpen
              ? "translate-x-0"
              : "max-[900px]:-translate-x-full"
          }
        `}
      >
        {/* LOGO */}
        <div className="relative flex h-[64px] items-center px-[16px]">
          <div className="flex items-center gap-[10px]">
            <div className="relative flex h-[47px] w-[47px] items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M24 42V14"
                  stroke="#D9F7E7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />

                <path
                  d="M24 18C19 12 12 11 7 14V37C13 34 19 36 24 42"
                  stroke="#D9F7E7"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />

                <path
                  d="M24 18C29 12 36 11 41 14V37C35 34 29 36 24 42"
                  stroke="#D9F7E7"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />

                <path
                  d="M15 19V29M33 19V29"
                  stroke="#D9F7E7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="leading-none">
              <div className="text-[18px] font-bold tracking-[-0.5px]">
                MAMTA
              </div>

              <div className="mt-[3px] text-[8px] font-normal text-white/90">
                E-Book Publication
              </div>
            </div>
          </div>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              absolute
              right-4
              top-5
              hidden
              max-[900px]:block
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="px-[12px]">
          {/* DASHBOARD */}
          <div
            className="
              flex
              h-[40px]
              items-center
              rounded-[9px]
              bg-[#09a978]
              px-[10px]
              shadow-[0_5px_15px_rgba(0,0,0,0.08)]
            "
          >
            <LayoutDashboard
              size={17}
              strokeWidth={2.2}
            />

            <span className="ml-[9px] text-[11px] font-semibold">
              Dashboard
            </span>
          </div>

          {/* BOOKS */}
          <div
            className="
              mt-[5px]
              flex
              h-[40px]
              items-center
              rounded-[9px]
              px-[10px]
            "
          >
            <BookOpen
              size={17}
              strokeWidth={1.9}
            />

            <span className="ml-[9px] text-[11px] font-semibold">
              Books
            </span>

            <ChevronDown
              size={15}
              className="ml-auto"
              strokeWidth={1.8}
            />
          </div>

          {/* EARNINGS */}
          <div
            className="
              flex
              h-[40px]
              items-center
              rounded-[9px]
              px-[10px]
            "
          >
            <IndianRupee
              size={16}
              strokeWidth={1.8}
            />

            <span className="ml-[10px] text-[11px] font-semibold">
              Earnings
            </span>

            <ChevronDown
              size={15}
              className="ml-auto"
              strokeWidth={1.8}
            />
          </div>

          {/* MORE */}
          <div
            className="
              flex
              h-[40px]
              items-center
              rounded-[9px]
              px-[10px]
            "
          >
            <MoreVertical
              size={17}
              strokeWidth={2}
            />

            <span className="ml-[9px] text-[11px] font-semibold">
              More
            </span>

            <ChevronDown
              size={15}
              className="ml-auto"
              strokeWidth={1.8}
            />
          </div>
        </nav>

        {/* BOTTOM USER */}
        <div className="absolute bottom-[29px] left-[12px] right-[12px]">
          <div
            className="
              overflow-hidden
              rounded-[9px]
              border
              border-white/20
              bg-white/[0.035]
            "
          >
            {/* USER */}
            <div className="flex items-center px-[16px] py-[16px]">
              <div
                className="
                  flex
                  h-[45px]
                  w-[45px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-[#e8f6ef]
                "
              >
                <div className="relative mt-[7px] h-[42px] w-[36px]">
                  <div
                    className="
                      absolute
                      left-[7px]
                      top-0
                      h-[20px]
                      w-[20px]
                      rounded-full
                      bg-[#f0b48e]
                    "
                  />

                  <div
                    className="
                      absolute
                      left-[3px]
                      top-[4px]
                      h-[13px]
                      w-[28px]
                      rounded-t-full
                      bg-[#292929]
                    "
                  />

                  <div
                    className="
                      absolute
                      left-[4px]
                      top-[17px]
                      h-[22px]
                      w-[28px]
                      rounded-t-[15px]
                      bg-[#16754f]
                    "
                  />
                </div>
              </div>

              <div className="ml-[11px] min-w-0">
                <div className="truncate text-[13px] font-semibold">
                  Admin User
                </div>

                <div className="mt-[5px] text-[11px] text-white/80">
                  Administrator
                </div>
              </div>

              <ChevronUp
                size={17}
                className="ml-auto shrink-0"
                strokeWidth={2}
              />
            </div>

            <div className="h-px bg-white/15" />

            {/* LOGOUT */}
            <button
              type="button"
              className="
                flex
                h-[55px]
                w-full
                items-center
                px-[16px]
                text-left
                hover:bg-white/5
              "
            >
              <LogOut
                size={21}
                strokeWidth={1.9}
              />

              <span className="ml-[13px] text-[14px] font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;