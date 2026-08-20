import {
  BookOpen,
  Users,
  ShoppingCart,
  IndianRupee,
  
  TrendingUp,
  TrendingDown,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";

/* =========================================================
   STATS
   ========================================================= */

const stats = [
  {
    title: "Total Books",
    value: "1,850",
    change: "24 this month",
    positive: true,
    footer: "24 Categories",
    icon: BookOpen,
    type: "green",
  },
  {
    title: "Total Students",
    value: "1,600",
    change: "32 this month",
    positive: true,
    footer: "Active users",
    icon: Users,
    type: "green",
  },
  {
    title: "Total Purchases",
    value: "1,250",
    change: "18 this month",
    positive: true,
    footer: "Successful Orders",
    icon: ShoppingCart,
    type: "yellow",
  },
  {
    title: "Total Revenue",
    value: "₹45,000",
    change: "18.4% vs last month",
    positive: true,
    footer: "This Month",
    icon: IndianRupee,
    type: "green",
  },
];

/* =========================================================
   REVENUE CHART DATA
   ========================================================= */

const chartDataByPeriod = {
  Weekly: [
    { month: "Mon", revenue: 32, purchases: 18 },
    { month: "Tue", revenue: 45, purchases: 26 },
    { month: "Wed", revenue: 38, purchases: 22 },
    { month: "Thu", revenue: 58, purchases: 35 },
    { month: "Fri", revenue: 72, purchases: 48 },
    { month: "Sat", revenue: 64, purchases: 42 },
    { month: "Sun", revenue: 50, purchases: 31 },
  ],

  Monthly: [
    { month: "Jan", revenue: 50, purchases: 40 },
    { month: "Feb", revenue: 63, purchases: 82 },
    { month: "Mar", revenue: 74, purchases: 44 },
    { month: "Apr", revenue: 73, purchases: 30 },
    { month: "May", revenue: 68, purchases: 30 },
    { month: "Jun", revenue: 78, purchases: 24 },
    { month: "Jul", revenue: 54, purchases: 69 },
    { month: "Aug", revenue: 40, purchases: 24 },
    { month: "Sep", revenue: 35, purchases: 9 },
    { month: "Oct", revenue: 30, purchases: 8 },
    { month: "Nov", revenue: 29, purchases: 9 },
    { month: "Dec", revenue: 40, purchases: 20 },
  ],

  Yearly: [
    { month: "2022", revenue: 42, purchases: 30 },
    { month: "2023", revenue: 58, purchases: 45 },
    { month: "2024", revenue: 72, purchases: 61 },
    { month: "2025", revenue: 65, purchases: 54 },
    { month: "2026", revenue: 82, purchases: 70 },
  ],
};

/* =========================================================
   CHART SUMMARY
   ========================================================= */

const chartSummary = {
  Weekly: {
    revenue: "₹45,800",
    purchases: "312",
  },

  Monthly: {
    revenue: "₹4,85,000",
    purchases: "5,420",
  },

  Yearly: {
    revenue: "₹52,40,000",
    purchases: "61,840",
  },
};

/* =========================================================
   TOP BOOKS
   ========================================================= */

const topBooks = [
  {
    title: "Discrete Mathematics",
    author: "S. Lipshutz",
    purchases: "120",
    revenue: "₹35,880",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&q=80",
  },
  {
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    purchases: "98",
    revenue: "₹29,302",
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&q=80",
  },
  {
    title: "Physics for Class 11",
    author: "D.C. Pandey",
    purchases: "76",
    revenue: "₹22,724",
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=100&q=80",
  },
];

/* =========================================================
   QUICK ACTIONS
   ========================================================= */

// const quickActions = [
//   {
//     title: "Add New Book",
//     description: "Upload a new ebook",
//     icon: BookOpen,
//   },
//   {
//     title: "Add Folder",
//     description: "Create new category",
//     icon: FolderPlus,
//   },
//   {
//     title: "Send Notification",
//     description: "Notify all users",
//     icon: Bell,
//   },
//   {
//     title: "View Transactions",
//     description: "See all orders",
//     icon: FileText,
//   },
// ];

/* =========================================================
   DASHBOARD
   ========================================================= */

export function Dashboard() {
  const [chartPeriod, setChartPeriod] =
    useState<keyof typeof chartDataByPeriod>("Monthly");

  /* =========================================================
     SELECTED GRAPH BAR
     ========================================================= */

  const [selectedChartMonth, setSelectedChartMonth] =
    useState<string | null>(null);

  /* =========================================================
     DATE RANGE
     ========================================================= */

  const [dateRange, setDateRange] = useState<
    [Date | null, Date | null]
  >([
    new Date(2026, 7, 14),
    new Date(2026, 7, 14),
  ]);

  const [startDate, endDate] = dateRange;

  const activeChartData =
    chartDataByPeriod[chartPeriod];

  const activeSummary =
    chartSummary[chartPeriod];

  /* =========================================================
     DATE FORMATTER
     ========================================================= */

  const formatDate = (date: Date | null) => {
    if (!date) return "";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     HANDLE CHART BAR CLICK
     ========================================================= */

  const handleChartBarClick = (month: string) => {
    setSelectedChartMonth((current) =>
      current === month ? null : month
    );
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="dashboard-top">

        <div>
          <p className="dashboard-welcome">
            Welcome back, <strong>Admin User!</strong>{" "}
            Here's what's happening with your platform
            today.
          </p>
        </div>

        {/* =================================================
            DATE PICKER
        ================================================= */}

        <div className="date-picker-wrapper">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-end"
            popperClassName="dashboard-date-popper"
            customInput={
              <button
                type="button"
                className="date-filter"
              >
                <CalendarDays size={16} />

                <span>
                  {startDate && endDate
                    ? `${formatDate(
                        startDate
                      )} - ${formatDate(endDate)}`
                    : "Select Date Range"}
                </span>

                <span className="date-arrow">
                  ▾
                </span>
              </button>
            }
          />
        </div>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-grid">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="stat-card"
              key={stat.title}
            >

              <div className="stat-main">

                <div
                  className={`stat-icon ${stat.type}`}
                >
                  <Icon size={25} />
                </div>

                <div className="stat-content">

                  <p className="stat-title">
                    {stat.title}
                  </p>

                  <h2>
                    {stat.value}
                  </h2>

                  <div
                    className={`stat-change ${
                      stat.positive
                        ? "positive"
                        : "negative"
                    }`}
                  >

                    {stat.positive ? (
                      <TrendingUp size={13} />
                    ) : (
                      <TrendingDown size={13} />
                    )}

                    <span>
                      {stat.change}
                    </span>

                  </div>

                </div>

              </div>

              <div className="stat-footer">

                <span
                  className={
                    stat.positive
                      ? "status-dot green-dot"
                      : "status-dot red-dot"
                  }
                />

                <span>
                  {stat.footer}
                </span>

              </div>

            </div>
          );
        })}

      </section>

      {/* =====================================================
          MAIN DASHBOARD GRID
      ===================================================== */}

      <section className="dashboard-grid">

        {/* =================================================
            REVENUE VS PURCHASES
        ================================================= */}

        <div className="revenue-card">

          <div className="section-header">

            <div>

              <h3>
                Revenue vs Purchases
              </h3>

              <div className="chart-legend">

                <span>
                  <i className="legend-box revenue" />
                  Revenue (₹)
                </span>

                <span>
                  <i className="legend-box purchase" />
                  Purchases
                </span>

              </div>

            </div>

            {/* =================================================
                CHART CONTROLS
            ================================================= */}

            <div className="chart-controls">

              <select
                className="year-select"
                value={chartPeriod}
                onChange={(e) => {

                  setChartPeriod(
                    e.target.value as keyof typeof chartDataByPeriod
                  );

                  setSelectedChartMonth(null);

                }}
              >

                <option value="Weekly">
                  Weekly
                </option>

                <option value="Monthly">
                  Monthly
                </option>

                <option value="Yearly">
                  Yearly
                </option>

              </select>

              <button
                type="button"
                className="chart-arrow disabled"
              >
                ←
              </button>

              <button
                type="button"
                className="chart-arrow active"
              >
                →
              </button>

            </div>

          </div>

          {/* =================================================
              CHART
          ================================================= */}

          <div className="chart-wrapper">

            <div className="chart-y-axis">

              <span>100K</span>
              <span>80K</span>
              <span>60K</span>
              <span>40K</span>
              <span>20K</span>
              <span>0</span>

            </div>

            <div className="chart-area">

              {/* =================================================
                  GRID LINES
              ================================================= */}

              <div className="chart-grid-lines">

                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />

              </div>

              {/* =================================================
                  BARS
              ================================================= */}

              <div className="bars">

                {activeChartData.map((item) => {

                  const isSelected =
                    selectedChartMonth ===
                    item.month;

                  return (

                    <div
                      className="chart-column"
                      key={item.month}
                    >

                      <div
                        className={`bar-group ${
                          isSelected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleChartBarClick(
                            item.month
                          )
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {

                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {
                            event.preventDefault();

                            handleChartBarClick(
                              item.month
                            );
                          }

                        }}
                      >

                        {/* =====================================
                            CLICKED VALUE TOOLTIP
                        ===================================== */}

                        {isSelected && (

                          <div className="chart-value-tooltip">

                            <div className="tooltip-month">
                              {item.month}
                            </div>

                            <div className="tooltip-row">

                              <span className="tooltip-dot revenue-dot" />

                              <span>
                                Revenue
                              </span>

                              <strong>
                                ₹{item.revenue}K
                              </strong>

                            </div>

                            <div className="tooltip-row">

                              <span className="tooltip-dot purchase-dot" />

                              <span>
                                Purchases
                              </span>

                              <strong>
                                {item.purchases}
                              </strong>

                            </div>

                          </div>

                        )}

                        {/* =====================================
                            REVENUE BAR
                        ===================================== */}

                        <div
                          className="bar revenue-bar"
                          style={{
                            height: `${item.revenue * 2}px`,
                          }}
                        />

                        {/* =====================================
                            PURCHASE BAR
                        ===================================== */}

                        <div
                          className="bar purchase-bar"
                          style={{
                            height: `${item.purchases * 2}px`,
                          }}
                        />

                      </div>

                      <span className="month">
                        {item.month}
                      </span>

                    </div>

                  );
                })}

              </div>

            </div>

          </div>

          {/* =================================================
              CHART SUMMARY
          ================================================= */}

          <div className="chart-summary">

            <div>

              <span>
                Total Revenue ({chartPeriod})
              </span>

              <strong>
                {activeSummary.revenue}
              </strong>

            </div>

            <div>

              <span>
                Total Purchases ({chartPeriod})
              </span>

              <strong>
                {activeSummary.purchases}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================================
            TOP SELLING BOOKS
        ================================================= */}

        <div className="top-books-card">

          <div className="section-title-row">

            <h3>
              Top Selling Books{" "}
              <span>
                (This Month)
              </span>
            </h3>

          </div>

          <div className="books-heading">

            <span>
              Book
            </span>

            <span>
              Purchases
            </span>

            <span>
              Revenue
            </span>

          </div>

          <div className="books-list">

            {topBooks.map((book) => (

              <div
                className="book-row"
                key={book.title}
              >

                <div className="book-info">

                  <img
                    src={book.cover}
                    alt={book.title}
                  />

                  <div>

                    <strong>
                      {book.title}
                    </strong>

                    <span>
                      {book.author}
                    </span>

                  </div>

                </div>

                <span className="book-purchases">
                  {book.purchases}
                </span>

                <span className="book-revenue">
                  {book.revenue}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      {/*

      <section className="quick-actions-card">

        <h3>
          Quick Actions
        </h3>

        <div className="quick-actions-grid">

          {quickActions.map((action) => {

            const Icon = action.icon;

            return (

              <button
                type="button"
                className="quick-action"
                key={action.title}
              >

                <div className="quick-action-icon">
                  <Icon size={38} />
                </div>

                <div className="quick-action-content">

                  <strong>
                    {action.title}
                  </strong>

                  <span>
                    {action.description}
                  </span>

                </div>

              </button>

            );

          })}

        </div>

      </section>

      */}

    </div>
  );
}

export default Dashboard;