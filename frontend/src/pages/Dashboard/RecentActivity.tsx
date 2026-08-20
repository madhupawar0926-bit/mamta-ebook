const activities = [
  {
    type: "purchase",
    title: "New Purchase",
    description: 'Rahul Sharma purchased "Discrete Mathematics"',
    amount: "₹299",
    time: "2 min ago",
  },
  {
    type: "student",
    title: "New Student",
    description: "Aman Verma joined the platform",
    time: "18 min ago",
  },
  {
    type: "review",
    title: "New Review",
    description: '5★ review for "Engineering Mathematics"',
    time: "1 hr ago",
  },
  {
    type: "book",
    title: "Book Published",
    description: '"Physics for Class 10" has been published',
    time: "3 hrs ago",
  },
  {
    type: "payment",
    title: "Payment Received",
    description: "Payment of ₹399 received from Neha Gupta",
    time: "5 hrs ago",
  },
];

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    purchase: "🛒",
    student: "●",
    review: "★",
    book: "▥",
    payment: "₹",
  };

  return <div className={`activity-icon ${type}`}>{icons[type]}</div>;
}

export function RecentActivity() {
  return (
    <section className="dashboard-panel activity-panel">
      <div className="panel-header">
        <h2>Recent Activity</h2>
        <button className="view-all-button">View All</button>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-item" key={`${activity.title}-${activity.time}`}>
            <ActivityIcon type={activity.type} />

            <div className="activity-details">
              <strong>{activity.title}</strong>
              <p>{activity.description}</p>

              {activity.amount && (
                <b>{activity.amount}</b>
              )}
            </div>

            <span className="activity-time">{activity.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}