function PlusIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h7l2 2h9v10H3z" />
      <path d="M16 12v5" />
      <path d="M13.5 14.5h5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-8-8 18-2-8z" />
      <path d="m11 13 10-10" />
    </svg>
  );
}

function TransactionIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v5h4" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

const actions = [
  {
    title: "Add New Book",
    description: "Upload a new ebook",
    icon: <PlusIcon />,
  },
  {
    title: "Add Folder",
    description: "Create new category",
    icon: <FolderIcon />,
  },
  {
    title: "Send Notification",
    description: "Notify all users",
    icon: <SendIcon />,
  },
  {
    title: "View Transactions",
    description: "See all orders",
    icon: <TransactionIcon />,
  },
];

export function QuickActions() {
  return (
    <section className="dashboard-panel quick-actions-panel">
      <div className="panel-header">
        <h2>Quick Actions</h2>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button className="quick-action-card" key={action.title}>
            <div className="quick-action-icon">{action.icon}</div>

            <strong>{action.title}</strong>

            <span>{action.description}</span>

            <div className="action-arrow">→</div>
          </button>
        ))}
      </div>
    </section>
  );
}