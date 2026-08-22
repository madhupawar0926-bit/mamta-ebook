import { useState } from "react";

const chartData = [
  { month: "Jan", revenue: 50, purchases: 40 },
  { month: "Feb", revenue: 63, purchases: 82 },
  { month: "Mar", revenue: 74, purchases: 44 },
  { month: "Apr", revenue: 68, purchases: 30 },
  { month: "May", revenue: 79, purchases: 24 },
  { month: "Jun", revenue: 78, purchases: 68 },
  { month: "Jul", revenue: 54, purchases: 24 },
  { month: "Aug", revenue: 40, purchases: 9 },
  { month: "Sep", revenue: 36, purchases: 9 },
  { month: "Oct", revenue: 30, purchases: 9 },
  { month: "Nov", revenue: 30, purchases: 9 },
  { month: "Dec", revenue: 40, purchases: 20 },
];

export function RevenueChart() {
  const maxValue = 100;

  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const hoveredData = chartData.find(
    (item) => item.month === hoveredMonth
  );

  return (
    <section className="dashboard-panel revenue-panel">
      {/* HEADER */}
      <div className="panel-header chart-header">
        <div>
          <div className="panel-title-row">
            <h2>Revenue vs Purchases</h2>
            <span className="info-icon">i</span>
          </div>

          <div className="chart-legend">
            <span>
              <i className="legend-box revenue" />
              Revenue (₹)
            </span>

            <span>
              <i className="legend-box purchases" />
              Purchases
            </span>
          </div>
        </div>

        <div className="chart-controls">
          <button className="year-select">
            This Year
          </button>

          <button className="chart-nav muted">
            ←
          </button>

          <button className="chart-nav active">
            →
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="chart-area">
        <div className="chart-y-axis">
          <span>100K</span>
          <span>80K</span>
          <span>60K</span>
          <span>40K</span>
          <span>20K</span>
          <span>0</span>
        </div>

        <div className="chart-content">

          {/* GRID */}
          <div className="chart-grid-lines">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          {/* TOOLTIP */}
          {hoveredData && (
            <div
              className="chart-value-tooltip"
              style={{
                pointerEvents: "none",
              }}
            >
              <div className="tooltip-month">
                {hoveredData.month}
              </div>

              <div className="tooltip-value revenue-value">
                <span className="tooltip-dot revenue-dot" />
                <span>Revenue</span>
                <strong>
                  ₹{hoveredData.revenue}K
                </strong>
              </div>

              <div className="tooltip-value purchase-value">
                <span className="tooltip-dot purchase-dot" />
                <span>Purchases</span>
                <strong>
                  {hoveredData.purchases}
                </strong>
              </div>
            </div>
          )}

          {/* BARS */}
          <div className="bars">
            {chartData.map((item) => {
              const isHovered =
                hoveredMonth === item.month;

              return (
                <div
                  key={item.month}
                  className={`bar-group ${
                    isHovered ? "selected" : ""
                  }`}
                  onMouseOver={() => {
                    setHoveredMonth(item.month);
                  }}
                  onMouseOut={(event) => {
                    const currentTarget = event.currentTarget;
                    const relatedTarget =
                      event.relatedTarget as Node | null;

                    if (
                      !relatedTarget ||
                      !currentTarget.contains(relatedTarget)
                    ) {
                      setHoveredMonth(null);
                    }
                  }}
                >
                  <div className="bar-pair">

                    {/* REVENUE */}
                    <div
                      className="bar revenue-bar"
                      style={{
                        height: `${
                          (item.revenue / maxValue) * 100
                        }%`,
                      }}
                    />

                    {/* PURCHASES */}
                    <div
                      className="bar purchase-bar"
                      style={{
                        height: `${
                          (item.purchases / maxValue) * 100
                        }%`,
                      }}
                    />

                  </div>

                  <span className="month-label">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="chart-summary">
        <div>
          <span>Total Revenue (This Year)</span>

          <strong>
            ₹4,85,000
          </strong>
        </div>

        <div>
          <span>Total Purchases (This Year)</span>

          <strong>
            5,420
          </strong>
        </div>
      </div>
    </section>
  );
}