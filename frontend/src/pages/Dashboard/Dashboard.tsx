import React from "react";
import {
  BookOpen,
  Users,
  ShoppingCart,
  IndianRupee,
  FileText,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  Send,
  ArrowRight,
  Star,
  Info,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  change: string;
  changeColor: string;
  footer: string;
  footerDot?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  title,
  value,
  change,
  changeColor,
  footer,
  footerDot,
}) => {
  return (
    <div
      style={{ minHeight: "130px" }}
      className="
        min-w-0
        rounded-[10px]
        border
        border-[#dfe5e3]
        bg-white
        px-[11px]
        py-[12px]
        shadow-[0_1px_3px_rgba(0,0,0,0.02)]
      "
    >
      <div className="flex min-w-0 items-center">
        <div
          className={`
            flex
            h-[61px]
            w-[61px]
            shrink-0
            items-center
            justify-center
            rounded-full
            ${iconBg}
          `}
        >
          {icon}
        </div>

        <div className="ml-[17px] min-w-0">
          <div className="truncate text-[12px] text-[#172127]">
            {title}
          </div>

          <div className="mt-[6px] text-[27px] font-medium leading-none text-[#11171b]">
            {value}
          </div>

          <div
            className={`mt-[7px] whitespace-nowrap text-[11px] ${changeColor}`}
          >
            {change}
          </div>
        </div>
      </div>

      <div className="my-[17px] h-px bg-[#e5e9e7]" />

      <div className="flex min-w-0 items-center text-[12px] text-[#303a40]">
        {footerDot ? (
          <span
            className={`
              mr-[10px]
              h-[9px]
              w-[9px]
              shrink-0
              rounded-full
              ${footerDot}
            `}
          />
        ) : (
          <Folder
            size={16}
            strokeWidth={1.6}
            className="mr-[9px] shrink-0 text-[#59656b]"
          />
        )}

        <span className="truncate">
          {footer}
        </span>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  bg: string;
  title: string;
  text: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  bg,
  title,
  text,
  time,
}) => {
  return (
    <div
      className="flex min-h-[64px] items-center border-b border-[#e4e8e7] last:border-b-0"
      style={{ minHeight: "58px" }}
    >
      <div
        className={`
          ml-[17px]
          flex
          h-[45px]
          w-[45px]
          shrink-0
          items-center
          justify-center
          rounded-full
          ${bg}
        `}
      >
        {icon}
      </div>

      <div className="ml-[15px] min-w-0 flex-1">
        <div className="truncate text-[12px] font-semibold text-[#11181c]">
          {title}
        </div>

        <div className="mt-[3px] truncate text-[11px] text-[#566168]">
          {text}
        </div>
      </div>

      <div className="mr-[17px] ml-[10px] shrink-0 text-[10px] text-[#718087]">
        {time}
      </div>
    </div>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  text,
}) => {
  return (
    <div
      className="
        flex
        h-[145px]
        min-w-0
        flex-1
        flex-col
        items-center
        justify-center
        rounded-[8px]
        border
        border-[#d4e9df]
        bg-[#f4fbf7]
      "
    >
      <div className="mb-[8px] text-[#006f4d]">
        {icon}
      </div>

      <div className="text-center text-[13px] font-semibold text-[#10171a]">
        {title}
      </div>

      <div className="mt-[9px] flex items-center text-[10px] text-[#67747a]">
        <span className="truncate">
          {text}
        </span>

        <ArrowRight
          size={16}
          className="ml-[12px] shrink-0 text-[#27363a]"
          strokeWidth={1.7}
        />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const revenue = [
    50,
    63,
    74,
    68,
    78,
    54,
    54,
    40,
    36,
    30,
    28,
    40,
  ];

  const purchases = [
    40,
    82,
    44,
    30,
    24,
    68,
    68,
    24,
    10,
    10,
    9,
    20,
  ];

  return (
    <div
      className="
        min-h-[calc(100vh-40px)]
        w-full
        min-w-0
        overflow-x-hidden
        relative
        bg-[#fafcfb]
      "
    >
      <div
        className="w-full min-w-0 px-[20px] pb-[24px] pt-[20px]"
        style={{ padding: "16px 16px 24px" }}
      >
        {/* WELCOME ROW */}
        <div className="flex min-w-0 items-center justify-between gap-[15px]">
          <div className="min-w-0 truncate text-[12px] text-[#596871]">
            Welcome back,{" "}
            <span className="font-medium text-[#172128]">
              Admin User!
            </span>{" "}
            Here's what's happening with your platform today.
          </div>

          <button
            type="button"
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              rounded-[7px]
              border
              border-[#dce2e0]
              bg-white
              px-[12px]
              text-[11px]
              text-[#29343a]
              max-[700px]:hidden
            "
          >
            <CalendarDays
              size={16}
              className="mr-[9px] text-[#526169]"
              strokeWidth={1.7}
            />

            14 Aug 2026 - 14 Aug 2026

            <ChevronDown
              size={16}
              className="ml-[11px]"
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* STATS */}
        <div
          style={{
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "13px",
          }}
          className="
            mt-[20px]
            grid
            grid-cols-5
            gap-[16px]
            max-[900px]:grid-cols-2
            max-[600px]:grid-cols-1
          "
        >
          <StatCard
            icon={
              <BookOpen
                size={28}
                strokeWidth={1.8}
                className="text-[#007746]"
              />
            }
            iconBg="bg-[#e7f7ed]"
            title="Total Books"
            value="1,850"
            change="↑ 24 this month"
            changeColor="text-[#07944f]"
            footer="24 Categories"
          />

          <StatCard
            icon={
              <Users
                size={29}
                strokeWidth={2}
                className="text-[#008043]"
              />
            }
            iconBg="bg-[#e4f7ea]"
            title="Total Students"
            value="1,600"
            change="↑ 32 this month"
            changeColor="text-[#07944f]"
            footer="Active users"
            footerDot="bg-[#0aa350]"
          />

          <StatCard
            icon={
              <ShoppingCart
                size={29}
                strokeWidth={1.8}
                className="text-[#ff9900]"
              />
            }
            iconBg="bg-[#fff7dd]"
            title="Total Purchases"
            value="1,250"
            change="↑ 18 this month"
            changeColor="text-[#07944f]"
            footer="Successful Orders"
            footerDot="bg-[#0aa350]"
          />

          <StatCard
            icon={
              <IndianRupee
                size={29}
                strokeWidth={2}
                className="text-[#008145]"
              />
            }
            iconBg="bg-[#e5f7eb]"
            title="Total Revenue"
            value="₹45,000"
            change="↑ 18.4% vs last month"
            changeColor="text-[#07944f]"
            footer="This Month"
            footerDot="bg-[#0aa350]"
          />

          <StatCard
            icon={
              <FileText
                size={28}
                strokeWidth={1.8}
                className="text-[#438fe9]"
              />
            }
            iconBg="bg-[#e8f2ff]"
            title="Failed Payments"
            value="12"
            change="↓ 3 vs last month"
            changeColor="text-[#ed3131]"
            footer="This Month"
            footerDot="bg-[#fa3e32]"
          />
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.25fr)",
            gap: "16px",
          }}
          className="
            mt-[20px]
            grid
            min-w-0
            grid-cols-[minmax(0,2.1fr)_minmax(0,1.25fr)]
            max-[1100px]:grid-cols-1
          "
        >
          {/* LEFT */}
          <div className="min-w-0">
            {/* REVENUE CHART */}
            <section className="min-w-0 overflow-hidden rounded-[10px] border border-[#dfe5e3] bg-white">
              <div className="flex min-w-0 items-center justify-between gap-[10px] px-[14px] pt-[16px]">
                <div className="flex min-w-0 items-center">
                  <h2 className="truncate text-[14px] font-semibold text-[#11181c]">
                    Revenue vs Purchases
                  </h2>

                  <Info
                    size={14}
                    className="ml-[8px] shrink-0 text-[#5d686e]"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-[12px]">
                  <button
                    type="button"
                    className="
                      flex
                      h-[35px]
                      w-[118px]
                      items-center
                      justify-between
                      rounded-[7px]
                      border
                      border-[#dce2e0]
                      px-[12px]
                      text-[11px]
                    "
                  >
                    This Year
                    <ChevronDown size={15} />
                  </button>

                  <button
                    type="button"
                    className="
                      flex
                      h-[35px]
                      w-[35px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f4f5f5]
                    "
                  >
                    <ChevronLeft
                      size={18}
                      className="text-[#9aa1a4]"
                    />
                  </button>

                  <button
                    type="button"
                    className="
                      flex
                      h-[35px]
                      w-[35px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#e9f8ee]
                    "
                  >
                    <ChevronRight
                      size={18}
                      className="text-[#008148]"
                    />
                  </button>
                </div>
              </div>

              {/* LEGEND */}
              <div className="flex items-center gap-[24px] px-[15px] pt-[12px]">
                <div className="flex items-center text-[11px] text-[#55616a]">
                  <span className="mr-[9px] h-[9px] w-[9px] rounded-[2px] bg-[#ff9715]" />
                  Revenue (₹)
                </div>

                <div className="flex items-center text-[11px] text-[#55616a]">
                  <span className="mr-[9px] h-[9px] w-[9px] rounded-[2px] bg-[#0db56b]" />
                  Purchases
                </div>
              </div>

              {/* CHART */}
              <div className="relative mx-[15px] mt-[21px] h-[250px]">
                {/* GRID */}
                <div className="absolute left-[49px] right-[10px] top-0 border-t border-dashed border-[#e3e7e6]" />

                <div className="absolute left-[49px] right-[10px] top-[40px] border-t border-dashed border-[#e3e7e6]" />

                <div className="absolute left-[49px] right-[10px] top-[80px] border-t border-dashed border-[#e3e7e6]" />

                <div className="absolute left-[49px] right-[10px] top-[120px] border-t border-dashed border-[#e3e7e6]" />

                <div className="absolute left-[49px] right-[10px] top-[160px] border-t border-dashed border-[#e3e7e6]" />

                <div className="absolute left-[49px] right-[10px] top-[200px] border-t border-[#d4dbd9]" />

                {/* Y LABELS */}
                <div className="absolute left-0 top-[-5px] text-[10px] text-[#77838b]">
                  100K
                </div>

                <div className="absolute left-[8px] top-[35px] text-[10px] text-[#77838b]">
                  80K
                </div>

                <div className="absolute left-[8px] top-[75px] text-[10px] text-[#77838b]">
                  60K
                </div>

                <div className="absolute left-[8px] top-[115px] text-[10px] text-[#77838b]">
                  40K
                </div>

                <div className="absolute left-[8px] top-[155px] text-[10px] text-[#77838b]">
                  20K
                </div>

                <div className="absolute left-[26px] top-[195px] text-[10px] text-[#77838b]">
                  0
                </div>

                {/* BARS */}
                <div className="absolute bottom-0 left-[49px] right-[10px] top-0 flex items-end justify-between">
                  {revenue.map((r, i) => (
                    <div
                      key={i}
                      className="
                        flex
                        h-full
                        w-[5.8%]
                        items-end
                        justify-center
                        gap-[5px]
                      "
                    >
                      <div
                        className="w-[9px] rounded-t-[1px] bg-[#ff9413]"
                        style={{
                          height: `${(r / 100) * 200}px`,
                        }}
                      />

                      <div
                        className="w-[9px] rounded-t-[1px] bg-[#0db56b]"
                        style={{
                          height: `${(purchases[i] / 100) * 200}px`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* MONTHS */}
                <div className="absolute bottom-[-25px] left-[49px] right-[10px] flex justify-between text-[10px] text-[#77838b]">
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((month) => (
                    <span key={month}>
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* TOTALS */}
              <div className="mx-[12px] mb-[12px] mt-[30px] flex min-w-0 h-[77px] rounded-[8px] border border-[#dfe6e3]">
                <div className="flex min-w-0 flex-1 flex-col justify-center px-[17px]">
                  <div className="truncate text-[11px] text-[#202b30]">
                    Total Revenue (This Year)
                  </div>

                  <div className="mt-[7px] text-[17px] font-semibold text-[#008c4b]">
                    ₹4,85,000
                  </div>
                </div>

                <div className="my-[15px] w-px shrink-0 bg-[#e2e7e5]" />

                <div className="flex min-w-0 flex-1 flex-col justify-center px-[17px]">
                  <div className="truncate text-[11px] text-[#202b30]">
                    Total Purchases (This Year)
                  </div>

                  <div className="mt-[7px] text-[17px] font-semibold text-[#008c4b]">
                    5,420
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="mt-[16px] rounded-[10px] border border-[#dfe5e3] bg-white px-[12px] pb-[17px] pt-[15px]">
              <h2 className="mb-[16px] text-[14px] font-semibold text-[#10171b]">
                Quick Actions
              </h2>

              <div className="flex gap-[14px] max-[700px]:grid max-[700px]:grid-cols-2">
                <QuickAction
                  icon={
                    <div className="flex h-[39px] w-[34px] items-center justify-center rounded-[4px] bg-[#006d4d] text-white">
                      <span className="text-[27px] font-semibold leading-none">
                        +
                      </span>
                    </div>
                  }
                  title="Add New Book"
                  text="Upload a new ebook"
                />

                <QuickAction
                  icon={
                    <div className="relative h-[39px] w-[39px]">
                      <Folder
                        size={39}
                        fill="#006d4d"
                        strokeWidth={1}
                        className="text-[#006d4d]"
                      />

                      <span className="absolute bottom-[-2px] right-[-3px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white text-[15px] font-bold text-[#006d4d]">
                        +
                      </span>
                    </div>
                  }
                  title="Add Folder"
                  text="Create new category"
                />

                <QuickAction
                  icon={
                    <Send
                      size={42}
                      fill="#006d4d"
                      strokeWidth={1}
                      className="-rotate-[17deg] text-[#006d4d]"
                    />
                  }
                  title="Send Notification"
                  text="Notify all users"
                />

                <QuickAction
                  icon={
                    <FileText
                      size={40}
                      fill="#006d4d"
                      strokeWidth={1}
                      className="text-[#006d4d]"
                    />
                  }
                  title="View Transactions"
                  text="See all orders"
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="min-w-0">
            {/* RECENT ACTIVITY */}
            <section className="min-w-0 overflow-hidden rounded-[10px] border border-[#dfe5e3] bg-white">
              <div className="flex items-center justify-between gap-[10px] px-[16px] pt-[16px]">
                <h2 className="truncate text-[14px] font-semibold text-[#10171b]">
                  Recent Activity
                </h2>

                <button
                  type="button"
                  className="h-[27px] shrink-0 rounded-[6px] border border-[#dce2e0] px-[11px] text-[10px] text-[#263238]"
                >
                  View All
                </button>
              </div>

              <div className="mt-[10px]">
                <ActivityItem
                  icon={
                    <ShoppingCart
                      size={23}
                      className="text-[#007b4c]"
                    />
                  }
                  bg="bg-[#e7f8ed]"
                  title="New Purchase"
                  text='Rahul Sharma purchased “Discrete Mathematics” ₹299'
                  time="2 min ago"
                />

                <ActivityItem
                  icon={
                    <Users
                      size={23}
                      className="text-[#007b4c]"
                    />
                  }
                  bg="bg-[#e7f8ed]"
                  title="New Student"
                  text="Aman Verma joined the platform"
                  time="18 min ago"
                />

                <ActivityItem
                  icon={
                    <Star
                      size={24}
                      fill="#ffac00"
                      className="text-[#ffac00]"
                    />
                  }
                  bg="bg-[#fff8df]"
                  title="New Review"
                  text='5★ review for “Engineering Mathematics”'
                  time="1 hr ago"
                />

                <ActivityItem
                  icon={
                    <BookOpen
                      size={23}
                      className="text-[#007b4c]"
                    />
                  }
                  bg="bg-[#e7f8ed]"
                  title="Book Published"
                  text='“Physics for Class 10” has been published'
                  time="3 hrs ago"
                />

                <ActivityItem
                  icon={
                    <IndianRupee
                      size={23}
                      className="text-[#007b4c]"
                    />
                  }
                  bg="bg-[#e7f8ed]"
                  title="Payment Received"
                  text="Payment of ₹399 received from Neha Gupta"
                  time="5 hrs ago"
                />
              </div>
            </section>

            {/* TOP SELLING */}
            <section className="mt-[16px] min-w-0 overflow-hidden rounded-[10px] border border-[#dfe5e3] bg-white">
              <div className="flex items-center justify-between gap-[10px] px-[16px] pt-[16px]">
                <h2 className="truncate text-[14px] font-semibold text-[#10171b]">
                  Top Selling Books (This Month)
                </h2>

                <button
                  type="button"
                  className="h-[27px] shrink-0 rounded-[6px] border border-[#dce2e0] px-[11px] text-[10px] text-[#263238]"
                >
                  View All
                </button>
              </div>

              <div className="mt-[13px]">
                {/* HEADER */}
                <div className="grid grid-cols-[minmax(0,1fr)_80px_78px] border-b border-[#e3e7e6] px-[16px] pb-[8px] text-[10px] text-[#6c777e]">
                  <span>Book</span>
                  <span className="text-center">
                    Purchases
                  </span>
                  <span className="text-right">
                    Revenue
                  </span>
                </div>

                {/* BOOK 1 */}
                <div className="grid min-h-[64px] grid-cols-[minmax(0,1fr)_80px_78px] items-center border-b border-[#e3e7e6] px-[16px]">
                  <div className="flex min-w-0 items-center">
                    <div className="flex h-[48px] w-[35px] shrink-0 items-center justify-center overflow-hidden bg-[#222] text-center text-[5px] font-bold text-white">
                      <div>
                        DISCRETE
                        <br />
                        MATHEMATICS
                      </div>
                    </div>

                    <div className="ml-[10px] min-w-0">
                      <div className="truncate text-[10px] font-medium text-[#222b30]">
                        Discrete Mathematics
                      </div>

                      <div className="mt-[4px] text-[10px] text-[#6c777e]">
                        S. Lipschutz
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-[#344047]">
                    120
                  </div>

                  <div className="text-right text-[10px] text-[#344047]">
                    ₹35,880
                  </div>
                </div>

                {/* BOOK 2 */}
                <div className="grid min-h-[64px] grid-cols-[minmax(0,1fr)_80px_78px] items-center border-b border-[#e3e7e6] px-[16px]">
                  <div className="flex min-w-0 items-center">
                    <div className="flex h-[48px] w-[35px] shrink-0 items-center justify-center overflow-hidden bg-[#214a91] text-center text-[5px] font-bold text-white">
                      ENGINEERING
                      <br />
                      MATHEMATICS
                    </div>

                    <div className="ml-[10px] min-w-0">
                      <div className="truncate text-[10px] font-medium text-[#222b30]">
                        Engineering Mathematics
                      </div>

                      <div className="mt-[4px] text-[10px] text-[#6c777e]">
                        B.S. Grewal
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-[#344047]">
                    98
                  </div>

                  <div className="text-right text-[10px] text-[#344047]">
                    ₹29,302
                  </div>
                </div>

                {/* BOOK 3 */}
                <div className="grid min-h-[64px] grid-cols-[minmax(0,1fr)_80px_78px] items-center px-[16px]">
                  <div className="flex min-w-0 items-center">
                    <div className="flex h-[48px] w-[35px] shrink-0 items-center justify-center overflow-hidden bg-[#d97823] text-center text-[5px] font-bold text-white">
                      PHYSICS
                      <br />
                      CLASS 11
                    </div>

                    <div className="ml-[10px] min-w-0">
                      <div className="truncate text-[10px] font-medium text-[#222b30]">
                        Physics for Class 11
                      </div>

                      <div className="mt-[4px] text-[10px] text-[#6c777e]">
                        D.C. Pandey
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-[#344047]">
                    76
                  </div>

                  <div className="text-right text-[10px] text-[#344047]">
                    ₹22,724
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;