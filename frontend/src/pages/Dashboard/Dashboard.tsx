import {
  BookOpen,
  Users,
  ShoppingCart,
  IndianRupee,
  // CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";
import { db } from "../../firebase";
import {
  getDashboardSnapshot,
  type DashboardPeriod,
  type DashboardSnapshot,
} from "../../services/dashboardRepository";

/* =========================================================
   DASHBOARD
   ========================================================= */

export function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState<DashboardPeriod>("Monthly");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null);
  const [loadError, setLoadError] = useState("");

  /* =========================================================
     HOVERED GRAPH BAR
     ========================================================= */

  const [hoveredChartMonth, setHoveredChartMonth] =
    useState<string | null>(null);

  /* =========================================================
     DATE RANGE
     ========================================================= */




  useEffect(() => {
    getDashboardSnapshot(db)
      .then(setDashboard)
      .catch((error) => {
        console.error("Failed to load dashboard", error);
        setLoadError("Unable to load dashboard data.");
      });
  }, []);

  if (!dashboard) {
    return <div className="dashboard-page">{loadError || "Loading dashboard..."}</div>;
  }

  const activeChartData = dashboard.chartData[chartPeriod].filter(
    (item) => chartPeriod !== "Yearly" || item.month === selectedYear
  );
  const chartMaxValue = Math.max(
    ...activeChartData.flatMap((item) => [item.revenue, item.purchases]),
    1
  );
  const activeSummary = dashboard.summaries[chartPeriod];
  const stats = [
    { title: "Total Books", value: dashboard.stats.totalBooks.toLocaleString(), footer: `${dashboard.stats.categoryCount} Categories`, icon: BookOpen, type: "green", positive: true },
    { title: "Total Students", value: dashboard.stats.totalStudents.toLocaleString(), footer: "Active users", icon: Users, type: "green", positive: true },
    { title: "Total Purchases", value: dashboard.stats.totalPurchases.toLocaleString(), footer: "Successful Orders", icon: ShoppingCart, type: "yellow", positive: true },
    { title: "Total Revenue", value: `₹${dashboard.stats.totalRevenue.toLocaleString("en-IN")}`, footer: "Successful sales", icon: IndianRupee, type: "green", positive: true },
  ];

  /* =========================================================
     DATE FORMATTER
     ========================================================= */

  // const formatDate = (date: Date | null) => {
  //   if (!date) return "";

  //   return date.toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

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

                  {/* <div
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

                  </div> */}

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
                    e.target.value as DashboardPeriod
                  );

                  setHoveredChartMonth(null);
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

              {chartPeriod === "Yearly" && (
                <select
                  className="year-select year-value-select"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setHoveredChartMonth(null);
                  }}
                  aria-label="Select year"
                >
                  {dashboard.chartData.Yearly.map((item) => (
                    <option value={item.month} key={item.month}>
                      {item.month}
                    </option>
                  ))}
                </select>
              )}

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

              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
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

                  const isHovered =
                    hoveredChartMonth ===
                    item.month;

                  return (
                    <div
                      className="chart-column"
                      key={item.month}
                    >

                      <div
                        className={`bar-group ${
                          isHovered
                            ? "hovered"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          setHoveredChartMonth(
                            item.month
                          )
                        }
                        onMouseLeave={() =>
                          setHoveredChartMonth(
                            null
                          )
                        }
                      >

                        {/* =====================================
                            HOVER TOOLTIP
                        ===================================== */}

                        {isHovered && (
                          <div className="chart-value-tooltip">

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
                            height: `${Math.max((item.revenue / chartMaxValue) * 220, 8)}px`,
                          }}
                        />

                        {/* =====================================
                            PURCHASE BAR
                        ===================================== */}

                        <div
                          className="bar purchase-bar"
                          style={{
                            height: `${Math.max((item.purchases / chartMaxValue) * 220, 8)}px`,
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
                ₹{activeSummary.revenue.toLocaleString("en-IN")}
              </strong>

            </div>

            <div>

              <span>
                Total Purchases ({chartPeriod})
              </span>

              <strong>
                {activeSummary.purchases.toLocaleString()}
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

            {dashboard.topBooks.map((book) => (

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
                  {book.purchases.toLocaleString()}
                </span>

                <span className="book-revenue">
                  ₹{book.revenue.toLocaleString("en-IN")}
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