import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import "./Earnings.css";


/* =========================================================
   TYPES
========================================================= */

type StatType =
  | "positive"
  | "warning"
  | "negative";

type EarningsData = {
  stats: Array<{
    title: string;
    value: string;
    change: string;
    type: StatType;
    icon: typeof IndianRupee;
    iconClass:
      | "green"
      | "blue"
      | "orange"
      | "red";
  }>;

  monthlyData: Array<{
    month: string;
    revenue: string;
    purchases: string;
    successful: string;
    failed: string;
    pending: string;
  }>;

  transactions: Array<{
    id: string;
    student: string;
    book: string;
    amount: string;
    status:
      | "Success"
      | "Pending"
      | "Failed";
    date: string;
  }>;

  chartData: Array<{
    label: string;
    revenue: number;
    purchases: number;
  }>;

  breakdown: Array<{
    label: string;
    value: string;
    percentage: number;
    dotClass:
      | "green-dot"
      | "blue-dot"
      | "purple-dot"
      | "orange-dot";
  }>;

  totalRevenue: string;
  totalPurchases: string;
  revenueGrowth: string;
  purchasesGrowth: string;
};


/* =========================================================
   FALLBACK DATA
========================================================= */

const fallbackData: EarningsData = {
  stats: [
    {
      title: "Total Revenue",
      value: "₹45,000",
      change: "18.4% vs last month",
      type: "positive",
      icon: IndianRupee,
      iconClass: "green",
    },

    {
      title: "Total Purchases",
      value: "1,250",
      change: "15.7% vs last month",
      type: "positive",
      icon: ShoppingCart,
      iconClass: "green",
    },

    {
      title: "Successful Payments",
      value: "1,214",
      change: "16.1% vs last month",
      type: "positive",
      icon: CheckCircle2,
      iconClass: "blue",
    },

    {
      title: "Pending Payments",
      value: "24",
      change: "2 vs last month",
      type: "warning",
      icon: Clock3,
      iconClass: "orange",
    },

    
  ],

  monthlyData: [
    {
      month: "August 2026 (Till 14 Aug)",
      revenue: "₹12,450",
      purchases: "342",
      successful: "330",
      failed: "5",
      pending: "7",
    },

    {
      month: "July 2026",
      revenue: "₹10,850",
      purchases: "301",
      successful: "291",
      failed: "6",
      pending: "4",
    },

    {
      month: "June 2026",
      revenue: "₹9,620",
      purchases: "275",
      successful: "262",
      failed: "4",
      pending: "9",
    },

    {
      month: "May 2026",
      revenue: "₹8,750",
      purchases: "240",
      successful: "231",
      failed: "3",
      pending: "6",
    },

    {
      month: "April 2026",
      revenue: "₹7,330",
      purchases: "210",
      successful: "200",
      failed: "5",
      pending: "5",
    },
  ],

  transactions: [
    {
      id: "ORD-10248",
      student: "Rahul Sharma",
      book: "Discrete Mathematics",
      amount: "₹299",
      status: "Success",
      date: "14 Aug 2026, 11:42 AM",
    },

    {
      id: "ORD-10247",
      student: "Neha Gupta",
      book: "Engineering Mathematics",
      amount: "₹199",
      status: "Success",
      date: "14 Aug 2026, 10:18 AM",
    },

    {
      id: "ORD-10246",
      student: "Aman Verma",
      book: "Physics for Class 11",
      amount: "₹249",
      status: "Success",
      date: "14 Aug 2026, 09:55 AM",
    },

    {
      id: "ORD-10245",
      student: "Kavya Singh",
      book: "Chemistry Class 12",
      amount: "₹299",
      status: "Pending",
      date: "14 Aug 2026, 09:05 AM",
    },

    {
      id: "ORD-10244",
      student: "Sahil Khan",
      book: "Maths for Class 10",
      amount: "₹199",
      status: "Failed",
      date: "14 Aug 2026, 08:33 AM",
    },
  ],

  chartData: [
    { label: "15 Jul", revenue: 19, purchases: 5 },
    { label: "16 Jul", revenue: 20, purchases: 5 },
    { label: "17 Jul", revenue: 21, purchases: 5 },
    { label: "18 Jul", revenue: 20, purchases: 6 },
    { label: "19 Jul", revenue: 22, purchases: 6 },
    { label: "20 Jul", revenue: 24, purchases: 7 },
    { label: "21 Jul", revenue: 24, purchases: 6 },
    { label: "22 Jul", revenue: 21, purchases: 6 },
    { label: "23 Jul", revenue: 22, purchases: 7 },
    { label: "24 Jul", revenue: 23, purchases: 7 },
    { label: "25 Jul", revenue: 23, purchases: 8 },
    { label: "26 Jul", revenue: 25, purchases: 7 },
    { label: "27 Jul", revenue: 27, purchases: 8 },
    { label: "28 Jul", revenue: 27, purchases: 8 },
    { label: "29 Jul", revenue: 26, purchases: 8 },
    { label: "30 Jul", revenue: 28, purchases: 8 },
    { label: "31 Jul", revenue: 29, purchases: 8 },
    { label: "1 Aug", revenue: 28, purchases: 7 },
    { label: "2 Aug", revenue: 29, purchases: 8 },
    { label: "3 Aug", revenue: 32, purchases: 7 },
    { label: "4 Aug", revenue: 34, purchases: 8 },
    { label: "5 Aug", revenue: 29, purchases: 7 },
    { label: "6 Aug", revenue: 30, purchases: 7 },
    { label: "7 Aug", revenue: 31, purchases: 7 },
    { label: "8 Aug", revenue: 32, purchases: 8 },
    { label: "9 Aug", revenue: 36, purchases: 8 },
    { label: "10 Aug", revenue: 38, purchases: 9 },
    { label: "11 Aug", revenue: 42, purchases: 10 },
    { label: "12 Aug", revenue: 41, purchases: 9 },
    { label: "13 Aug", revenue: 40, purchases: 9 },
    { label: "14 Aug", revenue: 39, purchases: 8 },
  ],

  breakdown: [
    {
      label: "Book Sales",
      value: "₹33,420",
      percentage: 74.3,
      dotClass: "green-dot",
    },

    {
      label: "Discounts Given",
      value: "₹6,230",
      percentage: 13.8,
      dotClass: "blue-dot",
    },

    {
      label: "Coupons Used",
      value: "₹3,650",
      percentage: 8.1,
      dotClass: "purple-dot",
    },

    {
      label: "Tax (GST)",
      value: "₹1,700",
      percentage: 3.8,
      dotClass: "orange-dot",
    },
  ],

  totalRevenue: "₹45,000",
  totalPurchases: "1,250",
  revenueGrowth: "18.4% vs last month",
  purchasesGrowth: "15.7% vs last month",
};


const API_ENDPOINT =
  "/api/earnings/overview";


/* =========================================================
   EARNINGS
========================================================= */

export default function Earnings() {

  const [data, setData] =
    useState<EarningsData>(fallbackData);

  const [range, setRange] =
    useState("30D");


  /* =======================================================
     LOAD API DATA
  ======================================================= */

  useEffect(() => {

    let active = true;

    const load = async () => {

      try {

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL || ""
          }${API_ENDPOINT}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const payload =
          (await response.json()) as Partial<EarningsData>;

        if (active) {

          setData((current) => ({
            ...current,
            ...payload,
          }));

        }

      } catch {

        // Keep fallback data silently
        // until API is connected.

      }
    };

    load();

    return () => {
      active = false;
    };

  }, []);


  /* =======================================================
     CHART CALCULATION
  ======================================================= */

  const chart = useMemo(() => {

    const width = 900;

    const height = 240;

    const max = 50;

    const top = 10;

    const bottom = 220;


    const revenuePoints =
      data.chartData.map(
        (item, index) => {

          const x =
            (index /
              Math.max(
                data.chartData.length - 1,
                1
              )) *
            width;

          const y =
            bottom -
            (item.revenue / max) *
              (bottom - top);

          return {
            x,
            y,
          };

        }
      );


    const purchasePoints =
      data.chartData.map(
        (item, index) => {

          const x =
            (index /
              Math.max(
                data.chartData.length - 1,
                1
              )) *
            width;

          const y =
            bottom -
            (item.purchases / max) *
              (bottom - top);

          return {
            x,
            y,
          };

        }
      );


    const revenueLine =
      revenuePoints
        .map(
          (p) => `${p.x},${p.y}`
        )
        .join(" ");


    const purchaseLine =
      purchasePoints
        .map(
          (p) => `${p.x},${p.y}`
        )
        .join(" ");


    const area = [
      `0,${bottom}`,

      ...revenuePoints.map(
        (p) => `${p.x},${p.y}`
      ),

      `${width},${bottom}`,
    ].join(" ");


    return {
      revenuePoints,
      purchasePoints,
      revenueLine,
      purchaseLine,
      area,
      height,
    };

  }, [data.chartData]);


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="earnings-page">

      {/* ===================================================
          TOP TABS + DATE
      =================================================== */}

      <div className="earnings-top-row">

        <div className="earnings-tabs">

          <button
            className="earnings-tab active"
            type="button"
          >
            Overview
          </button>

          <button
            className="earnings-tab"
            type="button"
          >
            Transactions
          </button>

          <button
            className="earnings-tab"
            type="button"
          >
            Coupons
          </button>

        </div>


        <button className="date-filter">
          <CalendarDays size={16} />

          <span>14 Aug 2026 - 14 Aug 2026</span>

          <span className="date-arrow">▾</span>
        </button>

      </div>


      {/* ===================================================
          STATS
      =================================================== */}

      <section className="earnings-stats">

        {data.stats.map((stat) => {

          const Icon = stat.icon;

          return (

            <div
              className="earnings-stat-card"
              key={stat.title}
            >

              <div
                className={`earnings-stat-icon ${stat.iconClass}`}
              >
                <Icon size={23} />
              </div>


              <div className="earnings-stat-content">

                <span className="earnings-stat-title">
                  {stat.title}
                </span>

                <strong className="earnings-stat-value">
                  {stat.value}
                </strong>

                <span
                  className={`earnings-stat-change ${stat.type}`}
                >
                  {stat.type === "negative"
                    ? "↓"
                    : "↑"}{" "}
                  {stat.change}
                </span>

              </div>

            </div>

          );

        })}

      </section>


      {/* ===================================================
          REVENUE OVERVIEW + BREAKDOWN
      =================================================== */}

      <section className="revenue-section">

        <div className="revenue-layout">

          {/* =================================================
              REVENUE OVERVIEW - LEFT
          ================================================= */}

          <div className="revenue-overview-column">

            <div className="revenue-header">

              <div className="revenue-title-row">

                <div className="section-title-row">

                  <h2>
                    Revenue Overview
                  </h2>

                  <span className="info-icon">
                    <span>i</span>
                  </span>

                </div>

                

              </div>
              <div className="revenue-summary">

                <div>
                  <strong>
                    {data.totalRevenue}
                  </strong>
                  <span>
                    Total Revenue
                  </span>
                  <small>
                    ↑ {data.revenueGrowth}
                  </small>
                </div>

                <div>
                  <strong>
                    {data.totalPurchases}
                  </strong>
                  <span>
                    Total Purchases
                  </span>
                  <small>
                    ↑ {data.purchasesGrowth}
                  </small>
                </div>
<div className="chart-toolbar">

                <div className="chart-filters">

                  {[
                    "7D",
                    "30D",
                    "6M",
                    "12M",
                    "This Year",
                  ].map((item) => (

                    <button
                      key={item}
                      type="button"
                      className={
                        range === item
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setRange(item)
                      }
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>
              </div>
<div className="chart-legend">
                    <span className="legend-line revenue-line" />
                    <span>Revenue (₹)</span>
                    <span className="legend-line purchase-line" />
                    <span>Purchases</span>
                  </div>
            </div>

            <div className="revenue-chart-wrapper">

             

              <div className="revenue-chart">

                <div className="chart-y-axis">
                  <span>50K</span>
                  <span>40K</span>
                  <span>30K</span>
                  <span>20K</span>
                  <span>10K</span>
                  <span>0</span>
                </div>
 {/* <div className="chart-legend">
                    <span className="legend-line revenue-line" />
                    <span>Revenue (₹)</span>
                    <span className="legend-line purchase-line" />
                    <span>Purchases</span>
                  </div> */}
                <div className="chart-area">

                  {/* <div className="chart-legend">
                    <span className="legend-line revenue-line" />
                    <span>Revenue (₹)</span>
                    <span className="legend-line purchase-line" />
                    <span>Purchases</span>
                  </div> */}

                  <div className="chart-grid">
                    {Array.from({
                      length: 6,
                    }).map((_, index) => (
                      <span key={index} />
                    ))}
                  </div>

                 <svg
  className="chart-svg"
  viewBox={`0 0 900 ${chart.height}`}
  preserveAspectRatio="none"
>
  {/* GREEN REVENUE AREA */}
  <polyline
    points={chart.area}
    fill="#08a66b"
    fillOpacity="0.10"
    stroke="none"
  />

  {/* ORANGE PURCHASE AREA */}
  <polyline
    points={[
      `0,220`,
      ...chart.purchasePoints.map(
        (point) => `${point.x},${point.y}`
      ),
      `900,220`,
    ].join(" ")}
    fill="#fff5e6"
    stroke="none"
  />

  {/* GREEN REVENUE LINE */}
  <polyline
    points={chart.revenueLine}
    fill="none"
    stroke="#08a66b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
  />

  {/* ORANGE PURCHASE LINE */}
  <polyline
    points={chart.purchaseLine}
    fill="none"
    stroke="#f59e0b"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
  />

  {/* GREEN CIRCLES */}
  {chart.revenuePoints.map((point, index) => (
    <circle
      key={`r-${index}`}
      cx={point.x}
      cy={point.y}
      r="2"
      fill="#fff"
      stroke="#08a66b"
      strokeWidth="1.2"
      vectorEffect="non-scaling-stroke"
    />
  ))}

  {/* ORANGE CIRCLES */}
  {chart.purchasePoints.map((point, index) => (
    <circle
      key={`p-${index}`}
      cx={point.x}
      cy={point.y}
      r="2"
      fill="#fff"
      stroke="#f59e0b"
      strokeWidth="1.2"
      vectorEffect="non-scaling-stroke"
    />
  ))}
</svg>

                  <div className="chart-x-axis">
                    <span>15 Jul</span>
                    <span>20 Jul</span>
                    <span>25 Jul</span>
                    <span>30 Jul</span>
                    <span>4 Aug</span>
                    <span>9 Aug</span>
                    <span>14 Aug</span>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              REVENUE BREAKDOWN - RIGHT
          ================================================= */}

          <div className="revenue-breakdown">

            <h2>
              Revenue Breakdown
            </h2>

            <div className="breakdown-content">

              <div className="donut-wrapper">

                <div className="donut-chart">

                  <div className="donut-center">
                    <strong>
                      {data.totalRevenue}
                    </strong>
                    <span>
                      Total
                    </span>
                  </div>

                </div>

              </div>

              <div className="breakdown-list">

                {data.breakdown.map(
                  (item) => (
                    <div
                      className="breakdown-item"
                      key={item.label}
                    >

                      <div className="breakdown-label">
                        <span
                          className={`legend ${item.dotClass}`}
                        />
                        <span>
                          {item.label}
                        </span>
                      </div>

                      <strong>
                        {item.value}
                      </strong>

                      <span>
                        {item.percentage}%
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          BOTTOM TWO PANELS
      =================================================== */}

      <div className="earnings-bottom-grid">

        {/* MONTHLY SUMMARY */}

        <section className="earnings-panel">

          <div className="panel-header">

            <h2>
              Monthly Summary
            </h2>

          </div>


          <div className="earnings-table-wrapper">

            <table className="earnings-table">

              <thead>

                <tr>

                  <th>
                    Month
                  </th>

                  <th>
                    Revenue (₹)
                  </th>

                  <th>
                    Purchases
                  </th>

                  <th>
                    Successful
                  </th>

                  <th>
                    Failed
                  </th>

                  <th>
                    Pending
                  </th>

                </tr>

              </thead>


              <tbody>

                {data.monthlyData.map(
                  (item) => (

                    <tr
                      key={item.month}
                    >

                      <td>
                        {item.month}
                      </td>

                      <td>
                        {item.revenue}
                      </td>

                      <td>
                        {item.purchases}
                      </td>

                      <td>
                        {item.successful}
                      </td>

                      <td className="failed-text">
                        {item.failed}
                      </td>

                      <td className="pending-text">
                        {item.pending}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          <button
            className="view-report-button"
            type="button"
          >
            View Full Report
            <span>→</span>
          </button>

        </section>


        {/* RECENT TRANSACTIONS */}

        <section className="earnings-panel">

          <div className="panel-header">

            <h2>
              Recent Transactions
            </h2>

            <button
              className="view-all-button"
              type="button"
            >
              View All
            </button>

          </div>


          <div className="earnings-table-wrapper">

            <table className="earnings-table transactions-table">

              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Book
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {data.transactions.map(
                  (transaction) => (

                    <tr
                      key={transaction.id}
                    >

                      <td>
                        {transaction.id}
                      </td>

                      <td>
                        {transaction.student}
                      </td>

                      <td>
                        {transaction.book}
                      </td>

                      <td>
                        {transaction.amount}
                      </td>

                      <td>

                        <span
                          className={`payment-status ${transaction.status.toLowerCase()}`}
                        >
                          {transaction.status}
                        </span>

                      </td>

                      <td>
                        {transaction.date}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>


      {/* ===================================================
          FOOTER INFO
      =================================================== */}

      <div className="earnings-info">

        <CreditCard size={15} />

        <span>
          All amounts are in Indian Rupees (₹)
          and include applicable taxes.
        </span>

      </div>

    </div>

  );
}