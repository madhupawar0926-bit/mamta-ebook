interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  footer: string;
  icon: React.ReactNode;
  variant: "green" | "yellow" | "blue";
}

export function StatCard({
  title,
  value,
  change,
  trend,
  footer,
  icon,
  variant,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${variant}`}>{icon}</div>

      <div className="stat-content">
        <p className="stat-title">{title}</p>

        <div className="stat-value">{value}</div>

        <div className={`stat-change ${trend === "down" ? "negative" : ""}`}>
          <span>{trend === "up" ? "↑" : "↓"}</span>
          {change}
        </div>
      </div>

      <div className="stat-divider" />

      <div className="stat-footer">
        <span className={`status-dot ${trend === "down" ? "red" : ""}`} />
        <span>{footer}</span>
      </div>
    </article>
  );
}