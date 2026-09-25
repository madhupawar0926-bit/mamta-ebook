import {
  Menu,
  Search,
  Bell,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import "./Header.css";

interface HeaderProps {
  onMenuClick?: () => void;
}

type NotificationItem = {
  id: string;
  type: "purchase" | "book" | "student";
  title: string;
  message: string;
  createdAt: number;
};

function Header({ onMenuClick }: HeaderProps) {

  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const isRecentTimestamp = (value: unknown) => {
    if (!value) return false;

    const toMillis = (val: unknown) => {
      if (val && typeof val === "object" && "toDate" in val && typeof val.toDate === "function") {
        return (val as { toDate: () => Date }).toDate().getTime();
      }

      if (val instanceof Date) {
        return val.getTime();
      }

      if (typeof val === "number") {
        return val * 1000;
      }

      if (typeof val === "string") {
        const parsed = Number(val);
        if (!Number.isNaN(parsed)) {
          return parsed * 1000;
        }
      }

      return null;
    };

    const time = toMillis(value);

    if (!time) return false;

    return Date.now() - time <= 24 * 60 * 60 * 1000;
  };

  const buildNotifications = (kind: NotificationItem["type"], docs: Array<Record<string, unknown>>): NotificationItem[] => {
    return docs
      .filter((doc) => {
        if (kind === "purchase") {
          return isRecentTimestamp(doc.purchasedAt ?? doc.createdAt);
        }

        if (kind === "book") {
          return isRecentTimestamp(doc.createdAt ?? doc.publishedAt ?? doc.updatedAt);
        }

        return isRecentTimestamp(doc.createdAt ?? doc.lastActiveAt) && doc.role === "student";
      })
      .slice(0, 5)
      .map((doc, index) => {
        if (kind === "purchase") {
          const title = String(doc.bookTitle ?? doc.title ?? "Book purchase");
          const student = String(doc.studentName ?? doc.studentUid ?? "Student");

          return {
            id: `${kind}-${String(doc.id ?? doc.bookId ?? index)}-${String(doc.purchasedAt ?? doc.createdAt ?? Date.now())}`,
            type: kind,
            title: "Purchase received",
            message: `${student} bought ${title}`,
            createdAt: Number((doc.purchasedAt ?? doc.createdAt as Timestamp ?? Date.now()) as number),
          };
        }

        if (kind === "book") {
          const title = String(doc.title ?? doc.name ?? "New book");

          return {
            id: `${kind}-${String(doc.id ?? title)}-${String(doc.createdAt ?? doc.publishedAt ?? Date.now())}`,
            type: kind,
            title: "Book published",
            message: `${title} is now live in the store`,
            createdAt: Number((doc.createdAt ?? doc.publishedAt ?? Date.now()) as number),
          };
        }

        const name = String(doc.name ?? "New student");

        return {
          id: `${kind}-${String(doc.id ?? name)}-${String(doc.createdAt ?? doc.lastActiveAt ?? Date.now())}`,
          type: kind,
          title: "New student login",
          message: `${name} joined as a new student`,
          createdAt: Number((doc.createdAt ?? doc.lastActiveAt ?? Date.now()) as number),
        };
      });
  };

  const notificationCount = notifications.length;

  useEffect(() => {
    const updateNotifications = (kind: NotificationItem["type"], docs: Array<Record<string, unknown>>) => {
      const items = buildNotifications(kind, docs);

      setNotifications((current) => {
        const remaining = current.filter((item) => item.type !== kind);
        return [...items, ...remaining].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
      });
    };

    const purchasesUnsubscribe = onSnapshot(collection(db, "purchases"), (snapshot) => {
      updateNotifications("purchase", snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const booksUnsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
      updateNotifications("book", snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const studentsUnsubscribe = onSnapshot(
      query(collection(db, "users"), where("role", "==", "student")),
      (snapshot) => {
        updateNotifications("student", snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      purchasesUnsubscribe();
      booksUnsubscribe();
      studentsUnsubscribe();
    };
  }, []);

  const getTitle = () => {

    if (location.pathname === "/") {
      return "Dashboard";
    }

    if (location.pathname.startsWith("/category/add")) {
      return "Add New Book";
    }

    if (location.pathname.startsWith("/category/folder/add")) {
      return "Add New Folder";
    }

    if (location.pathname.startsWith("/category")) {
      return "Categories & Book Management";
    }

    if (location.pathname.startsWith("/earnings")) {
      return "Earnings";
    }
 if (location.pathname.startsWith("/securitycontrol")) {
      return "Security Controls";
    }
    return "Dashboard";
  };

  return (
    <header className="app-header">

      <div className="header-left">

        {/* MOBILE hamburger */}
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <h1>{getTitle()}</h1>

      </div>


      <div className="header-right">

        <div className="header-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search books, users, orders..."
          />

        </div>

        <div className="notification-wrapper">
          <button
            type="button"
            className="notification-button"
            title={`${notificationCount} new notifications`}
            onClick={() => setIsNotificationOpen((current) => !current)}
            aria-expanded={isNotificationOpen}
            aria-label="Open notifications"
          >
            <Bell size={20} />

            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="notification-panel" role="dialog" aria-label="Recent notifications">
              <div className="notification-panel-header">Recent notifications</div>

              {notifications.length > 0 ? (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-dot" data-type={notification.type} />

                      <div className="notification-copy">
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="notification-empty">No recent notifications</div>
              )}
            </div>
          )}
        </div>


        {/* <div className="header-user">

          <div className="header-avatar">
            AU
          </div>

          <div className="header-user-info">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={16} />

        </div> */}

      </div>

    </header>
  );
}

export default Header;