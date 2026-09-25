import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Laptop,
  Phone,
  Search,
  Shield,
  ShoppingCart,
  Smartphone,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { db } from "../../firebase";
import {
  getStudentDevices,
  getStudentPurchases,
  getPurchaseStats,
  getStudents,
  type DeviceRecord,
  type PurchasedBookRecord,
  type StudentRecord,
} from "../../services/studentRepository";

import "./StudentDetail.css";

type StudentStatus = "Active" | "Flagged" | "Banned";

/* =========================================================
   AVATAR COLORS
========================================================= */

const avatarClasses = [
  "avatar-green",
  "avatar-purple",
  "avatar-yellow",
  "avatar-violet",
  "avatar-blue",
  "avatar-pink",
  "avatar-cyan",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function StudentDetails() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [rowMenuStudentId, setRowMenuStudentId] = useState<string | null>(null);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBookRecord[]>([]);
  const [loginDevices, setLoginDevices] = useState<DeviceRecord[]>([]);
  const [purchaseStats, setPurchaseStats] = useState({ activeBuyers: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All Status" | StudentStatus
  >("All Status");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const totalStudents = students.length;
  const pageSize = 7;
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize));

  /* =======================================================
     SELECTED STUDENT
  ======================================================= */

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId
  ) ?? students[0];

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const records = await getStudents(db);
        setStudents(records);
        setSelectedStudentId((current) => current || records[0]?.id || "");
      } catch (error) {
        console.error("Failed to load students", error);
        setLoadError("Unable to load students. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadStudents();
  }, []);

  useEffect(() => {
    const loadPurchaseStats = async () => {
      try {
        const stats = await getPurchaseStats(db);
        setPurchaseStats(stats);
      } catch (error) {
        console.error("Failed to load purchase stats", error);
      }
    };

    void loadPurchaseStats();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) {
      setPurchasedBooks([]);
      setLoginDevices([]);
      return;
    }

    const loadStudentDetails = async () => {
      try {
        const [purchases, devices] = await Promise.all([
          getStudentPurchases(db, selectedStudentId),
          getStudentDevices(db, selectedStudentId),
        ]);
        setPurchasedBooks(purchases);
        setLoginDevices(devices);
      } catch (error) {
        console.error("Failed to load student details", error);
        setLoadError("Unable to load this student's details.");
      }
    };

    void loadStudentDetails();
  }, [selectedStudentId]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "All Status" ||
        student.status === statusFilter;

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        student.name.toLowerCase().includes(searchValue) ||
        student.phone.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [students, statusFilter, search]);

  useEffect(() => {
    if (!students.length) {
      setSelectedStudentId("");
      setPurchasedBooks([]);
      setLoginDevices([]);
      return;
    }

    if (filteredStudents.length === 0) {
      setSelectedStudentId("");
      setPurchasedBooks([]);
      setLoginDevices([]);
      return;
    }

    if (!filteredStudents.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId, students]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const goToPage = (newPage: number) => {
    const safePage = Math.max(1, Math.min(totalPages, newPage));

    setPage(safePage);
  };

  const handleToggleBanStudent = (studentId: string) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        const nextIsBanned = student.status !== "Banned";

        return {
          ...student,
          status: nextIsBanned ? "Banned" : "Active",
          accountStatus: nextIsBanned ? "Banned" : "Active",
        };
      })
    );

    setRowMenuStudentId(null);
  };

  if (isLoading) {
    return (
      <div className="student-details-page student-data-state">
        Loading students...
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="student-details-page student-data-state" role={loadError ? "alert" : undefined}>
        {loadError || "No student records found."}
      </div>
    );
  }

  const bannedStudents = students.filter((student) => student.status === "Banned").length;

  return (
    <div className="student-details-page">
      {/* =====================================================
          TOP STAT CARDS
      ===================================================== */}

      <section className="student-stats">
        {/* TOTAL STUDENTS */}

        <div className="student-stat-card">
          <div className="student-stat-icon green">
            <UsersRound size={22} strokeWidth={1.8} />
          </div>

          <div className="student-stat-content">
            <span className="student-stat-title">
              Total Students
            </span>

            <strong className="student-stat-value">
              {totalStudents.toLocaleString()}
            </strong>

            <span className="student-stat-change positive">
              ↑ 8.4% vs last month
            </span>
          </div>
        </div>

        {/* ACTIVE BUYERS */}

        <div className="student-stat-card">
          <div className="student-stat-icon green">
            <ShoppingCart size={22} strokeWidth={1.8} />
          </div>

          <div className="student-stat-content">
            <span className="student-stat-title">
              Active Buyers
            </span>

            <strong className="student-stat-value">
              {purchaseStats.activeBuyers.toLocaleString()}
            </strong>

            <span className="student-stat-change positive">
              ↑ 6.7% vs last month
            </span>
          </div>
        </div>

        {/* BANNED STUDENTS */}

        <div className="student-stat-card">
          <div className="student-stat-icon red">
            <Shield size={22} strokeWidth={1.8} />
          </div>

          <div className="student-stat-content">
            <span className="student-stat-title">
              Banned Students
            </span>

            <strong className="student-stat-value">
              {bannedStudents.toLocaleString()}
            </strong>

            <span className="student-stat-change negative">
              ↑ 4.2% vs last month
            </span>
          </div>
        </div>

        {/* TOTAL REVENUE */}

        <div className="student-stat-card">
          <div className="student-stat-icon green">
            <WalletCards size={22} strokeWidth={1.8} />
          </div>

          <div className="student-stat-content">
            <span className="student-stat-title">
              Total Student Revenue
            </span>

            <strong className="student-stat-value">
              {`Rs.${purchaseStats.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            </strong>

            <span className="student-stat-change positive">
              ↑ 12.3% vs last month
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="student-main-grid">
        {/* ===================================================
            LEFT - STUDENTS
        =================================================== */}

        <div className="students-panel">
          {/* HEADER */}

          <div className="students-panel-header">
            <div className="students-heading">
              <UsersRound size={18} strokeWidth={1.8} />

              <h2>Students</h2>
            </div>

            <div className="students-header-actions">
              {/* SEARCH */}

              <div className="student-search">
                <Search size={14} />

                <input
                  type="text"
                  placeholder="Search student"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* FILTER */}

              <div className="student-filter">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target.value as
                        | "All Status"
                        | StudentStatus
                    );

                    setPage(1);
                  }}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Flagged</option>
                  <option>Banned</option>
                </select>

                <ChevronDown size={14} />
              </div>

              {/* MORE */}
{/* 
              <button
                type="button"
                className="student-more-button"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button> */}
            </div>
          </div>

          {/* TABLE */}

          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student</th>

                  <th>Phone Number</th>

                  <th>Books Purchased</th>

                  <th>Total Spent</th>

                  <th>Status</th>

                  {/* <th className="action-column"></th> */}
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={
                      selectedStudentId === student.id
                        ? "selected-student-row"
                        : ""
                    }
                    onClick={() =>
                      setSelectedStudentId(student.id)
                    }
                  >
                    {/* STUDENT */}

                    <td>
                      <div className="student-name-cell">
                        <div
                          className={`student-avatar ${
                            avatarClasses[
                              index % avatarClasses.length
                            ]
                          }`}
                        >
                          {student.initials}
                        </div>

                        <span>{student.name}</span>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td>{student.phone}</td>

                    {/* BOOKS */}

                    <td>{student.books}</td>

                    {/* SPENT */}

                    <td>{student.spent}</td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`student-status ${student.status.toLowerCase()}`}
                      >
                        {student.status}
                      </span>
                    </td>

                    {/* MORE */}

                    {/* <td className="action-cell">
                      <div className="row-action-wrap">
                        <button
                          type="button"
                          className="row-more-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setRowMenuStudentId((current) =>
                              current === student.id ? null : student.id
                            );
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {rowMenuStudentId === student.id && (
                          <div
                            className="row-menu"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="row-menu-item"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleBanStudent(student.id);
                              }}
                            >
                              {student.status === "Banned"
                                ? "Unban Student"
                                : "Ban Student"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td> */}
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="students-empty"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="students-pagination">
            <span className="students-count">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, totalStudents)} of{" "}
              {totalStudents.toLocaleString()} students
            </span>

            <div className="pagination-controls">
              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-arrow"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeft size={17} />
              </button>

              {/* 1 */}

              <button
                type="button"
                className={`pagination-number ${
                  page === 1 ? "active" : ""
                }`}
                onClick={() => goToPage(1)}
              >
                1
              </button>

              {/* 2 */}

              <button
                type="button"
                className={`pagination-number ${
                  page === 2 ? "active" : ""
                }`}
                onClick={() => goToPage(2)}
              >
                2
              </button>

              {/* 3 */}

              <button
                type="button"
                className={`pagination-number ${
                  page === 3 ? "active" : ""
                }`}
                onClick={() => goToPage(3)}
              >
                3
              </button>

              {/* DOTS */}

              <span className="pagination-dots">
                ...
              </span>

              {/* LAST */}

              <button
                type="button"
                className={`pagination-number ${
                  page === totalPages ? "active" : ""
                }`}
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </button>

              {/* NEXT */}

              <button
                type="button"
                className="pagination-arrow"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT - STUDENT DETAILS
        =================================================== */}

        <aside className="student-profile-panel">
          {/* PROFILE HEADER */}

          <div className="student-profile-header">
            <div className="student-profile-main">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {selectedStudent.initials}
                </div>

                <span className="profile-verified">
                  <CheckCircle2 size={12} />
                </span>
              </div>

              <div className="profile-name-block">
                <h2>{selectedStudent.name}</h2>

                <div className="profile-contact">
                  <Phone size={12} />

                  <span>
                    {selectedStudent.phone}
                  </span>
                </div>

                {/* <div className="profile-contact">
                  <Mail size={12} />

                  <span>
                    {selectedStudent.email}
                  </span>
                </div> */}
              </div>
            </div>

            <span
              className={`profile-status ${selectedStudent.status.toLowerCase()}`}
            >
              {selectedStudent.status === "Flagged" && (
                <AlertTriangle size={12} />
              )}

              {selectedStudent.status}
            </span>
          </div>

          {/* DIVIDER */}

          <div className="profile-divider" />

          {/* INFO */}

          <div className="profile-info">
            <div className="profile-info-row">
              <span>Registration Date</span>

              <strong>
                {selectedStudent.registrationDate}
              </strong>
            </div>

            

            <div className="profile-info-row">
              <span>Account Status</span>

              <strong>
                {selectedStudent.accountStatus}
              </strong>
            </div>

            <div className="profile-info-row">
              <span>Books Purchased</span>

              <strong>
                {selectedStudent.booksPurchased}
              </strong>
            </div>

            <div className="profile-info-row">
              <span>Total Spent</span>

              <strong className="profile-money">
                {selectedStudent.totalSpent}
              </strong>
            </div>
          </div>

          {/* LOGIN DEVICES */}

          <section className="login-devices-section">
            <div className="login-devices-heading">
              <div>
                <Laptop size={16} />
                <h3>Login Devices</h3>
              </div>

              <span>{loginDevices.length} / 2</span>
            </div>

            <p className="login-devices-limit">
              Maximum 2 devices can be logged in at once.
            </p>

            <button
              type="button"
              className="view-devices-button"
              onClick={() => setIsDevicesModalOpen(true)}
            >
              View device details
            </button>
          </section>

          {/* SECURITY ALERT */}

          {selectedStudent.status === "Flagged" && (
            <div className="security-alert">
              <div className="security-alert-icon">
                <AlertTriangle size={19} />
              </div>

              <div>
                <strong>
                  Security Alert: Suspicious activity detected
                </strong>

                <span>
                  Multiple screenshots and unusual access
                  attempts reported.
                </span>
              </div>
            </div>
          )}

          {/* PURCHASED BOOKS */}

          <div className="purchased-books-section">
            <div className="purchased-books-heading">
              <ShoppingCart size={17} />

              <h3>Purchased Books</h3>
            </div>

            <div className="purchased-books-list">
              {purchasedBooks.map((book) => {
                const bookInitials = (book.title || "B")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("") || "B";

                return (
                  <div
                    className="purchased-book"
                    key={`${book.id}-${book.title}`}
                  >
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                      />
                    ) : (
                      <div className="purchased-book-placeholder">
                        {bookInitials}
                      </div>
                    )}

                    <div className="purchased-book-info">
                      <strong>{book.title}</strong>

                      <span>{book.date}</span>
                    </div>

                    <span className="book-price">
                      {book.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ONLY BAN BUTTON */}
          {/* View Full History removed */}

          <div className="student-profile-actions">
            <button
              type="button"
              className="ban-student-button"
              onClick={() => handleToggleBanStudent(selectedStudent.id)}
            >
              <UserRound size={16} />

              {selectedStudent.status === "Banned"
                ? "Unban Student"
                : "Ban Student"}
            </button>
          </div>
        </aside>
      </section>

      {isDevicesModalOpen && (
        <div className="devices-modal-backdrop" role="presentation">
          <div
            className="devices-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-devices-title"
          >
            <div className="devices-modal-header">
              <div>
                <span className="devices-modal-eyebrow">
                  {selectedStudent.name}
                </span>
                <h2 id="login-devices-title">Login Devices</h2>
              </div>

              <button
                type="button"
                className="devices-modal-close"
                onClick={() => setIsDevicesModalOpen(false)}
                aria-label="Close login devices dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p className="devices-modal-description">
              {loginDevices.length} of 2 allowed devices are currently logged in.
            </p>

            <div className="login-device-list">
              {loginDevices.slice(0, 2).map((device) => {
                const DeviceIcon = device.kind === "laptop" ? Laptop : Smartphone;

                return (
                  <div className="login-device-card" key={device.name}>
                    <div className="login-device-icon">
                      <DeviceIcon size={18} />
                    </div>

                    <div className="login-device-content">
                      <strong>{device.name}</strong>
                      <span>Model: {device.model}</span>
                      <span>{device.details}</span>
                      <small>{device.lastActive}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}