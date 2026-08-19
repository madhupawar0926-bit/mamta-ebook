import React from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  setMobileOpen,
}) => {
  return (
    <header
      className="
        fixed
        left-[178px]
        right-0
        top-0
        z-30
        h-[40px]
        border-b
        border-[#e5e9e7]
        bg-white
        max-[900px]:left-0
      "
    >
      <div className="flex h-full min-w-0 items-center px-[17px]">
        {/* MENU */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            flex
            h-[28px]
            w-[28px]
            shrink-0
            items-center
            justify-center
          "
        >
          <Menu
            size={19}
            strokeWidth={1.8}
            className="text-[#48555a]"
          />
        </button>

        {/* TITLE */}
        <h1
          className="
            ml-[12px]
            shrink-0
            whitespace-nowrap
            text-[16px]
            font-semibold
            text-[#101418]
          "
        >
          Dashboard
        </h1>

        {/* RIGHT SIDE */}
        <div
          className="ml-auto flex min-w-0 items-center"
          style={{ marginLeft: "auto" }}
        >
          {/* SEARCH */}
          <div
            className="
              flex
              h-[29px]
              w-[247px]
              shrink-0
              items-center
              rounded-[7px]
              border
              border-[#dce2e1]
              bg-white
              max-[1100px]:w-[210px]
              max-[900px]:w-[200px]
              max-[700px]:hidden
            "
          >
            <input
              type="text"
              placeholder="Search books, users, orders..."
              className="
                h-full
                min-w-0
                flex-1
                bg-transparent
                px-[12px]
                text-[10px]
                text-[#273238]
                outline-none
                placeholder:text-[#8b959b]
              "
            />

            <Search
              size={16}
              strokeWidth={1.8}
              className="mr-[10px] shrink-0 text-[#49565d]"
            />
          </div>

          {/* NOTIFICATION */}
          <button
            type="button"
            className="
              relative
              ml-[27px]
              flex
              h-[38px]
              w-[30px]
              shrink-0
              items-center
              justify-center
            "
          >
            <Bell
              size={21}
              strokeWidth={1.7}
              className="text-[#46525a]"
            />

            <span
              className="
                absolute
                right-[-1px]
                top-[-3px]
                flex
                h-[15px]
                min-w-[15px]
                items-center
                justify-center
                rounded-full
                bg-[#df242b]
                px-[3px]
                text-[9px]
                font-bold
                text-white
              "
            >
              6
            </span>
          </button>

          {/* AVATAR */}
          <div
            className="
              ml-[18px]
              flex
              h-[38px]
              w-[38px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[#e8f5ec]
            "
          >
            <div className="relative mt-[7px] h-[38px] w-[32px]">
              <div
                className="
                  absolute
                  left-[6px]
                  top-0
                  h-[19px]
                  w-[19px]
                  rounded-full
                  bg-[#f0b48e]
                "
              />

              <div
                className="
                  absolute
                  left-[3px]
                  top-[2px]
                  h-[13px]
                  w-[25px]
                  rounded-t-full
                  bg-[#282828]
                "
              />

              <div
                className="
                  absolute
                  left-[3px]
                  top-[16px]
                  h-[22px]
                  w-[26px]
                  rounded-t-[14px]
                  bg-[#16764f]
                "
              />
            </div>
          </div>

          <ChevronDown
            size={17}
            className="ml-[12px] shrink-0 text-[#59656b]"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;