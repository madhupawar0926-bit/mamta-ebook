import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Shield,
  ShoppingCart,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { useMemo, useState } from "react";

import "./StudentDetail.css";

type StudentStatus = "Active" | "Flagged" | "Banned";

type Student = {
  id: number;
  initials: string;
  name: string;
  phone: string;
  email: string;
  books: number;
  spent: string;
  status: StudentStatus;
  registrationDate: string;
  lastActive: string;
  accountStatus: string;
  booksPurchased: string;
  totalSpent: string;
};

type PurchasedBook = {
  title: string;
  date: string;
  price: string;
  image: string;
};

/* =========================================================
   STUDENT DATA
========================================================= */

const students: Student[] = [
  {
    id: 1,
    initials: "RS",
    name: "Rohit Sharma",
    phone: "98765 43210",
    email: "rohit.sharma@email.com",
    books: 8,
    spent: "Rs.2,950.00",
    status: "Flagged",
    registrationDate: "12 Apr 2024, 10:30 AM",
    lastActive: "Today, 09:15 AM",
    accountStatus: "Active",
    booksPurchased: "8 Books",
    totalSpent: "Rs.2,950.00",
  },
  {
    id: 2,
    initials: "AP",
    name: "Anjali Patel",
    phone: "91234 56789",
    email: "anjali.patel@email.com",
    books: 5,
    spent: "Rs.1,450.00",
    status: "Active",
    registrationDate: "18 Apr 2024, 11:15 AM",
    lastActive: "Today, 08:45 AM",
    accountStatus: "Active",
    booksPurchased: "5 Books",
    totalSpent: "Rs.1,450.00",
  },
  {
    id: 3,
    initials: "VK",
    name: "Vikram Kumar",
    phone: "99887 66554",
    email: "vikram.kumar@email.com",
    books: 3,
    spent: "Rs.850.00",
    status: "Flagged",
    registrationDate: "21 Apr 2024, 02:20 PM",
    lastActive: "Yesterday, 07:30 PM",
    accountStatus: "Flagged",
    booksPurchased: "3 Books",
    totalSpent: "Rs.850.00",
  },
  {
    id: 4,
    initials: "NS",
    name: "Neha Singh",
    phone: "90345 67890",
    email: "neha.singh@email.com",
    books: 12,
    spent: "Rs.4,250.00",
    status: "Active",
    registrationDate: "25 Mar 2024, 09:45 AM",
    lastActive: "Today, 10:05 AM",
    accountStatus: "Active",
    booksPurchased: "12 Books",
    totalSpent: "Rs.4,250.00",
  },
  {
    id: 5,
    initials: "AM",
    name: "Aman Mishra",
    phone: "88990 11223",
    email: "aman.mishra@email.com",
    books: 2,
    spent: "Rs.599.00",
    status: "Active",
    registrationDate: "03 May 2024, 01:10 PM",
    lastActive: "Today, 08:10 AM",
    accountStatus: "Active",
    booksPurchased: "2 Books",
    totalSpent: "Rs.599.00",
  },
  {
    id: 6,
    initials: "PK",
    name: "Pooja Kulkarni",
    phone: "97854 32109",
    email: "pooja.kulkarni@email.com",
    books: 7,
    spent: "Rs.1,899.00",
    status: "Banned",
    registrationDate: "09 Feb 2024, 04:25 PM",
    lastActive: "10 Aug 2026, 05:40 PM",
    accountStatus: "Banned",
    booksPurchased: "7 Books",
    totalSpent: "Rs.1,899.00",
  },
  {
    id: 7,
    initials: "SJ",
    name: "Saurabh Joshi",
    phone: "96655 44332",
    email: "saurabh.joshi@email.com",
    books: 4,
    spent: "Rs.1,199.00",
    status: "Active",
    registrationDate: "14 May 2024, 12:40 PM",
    lastActive: "Today, 09:50 AM",
    accountStatus: "Active",
    booksPurchased: "4 Books",
    totalSpent: "Rs.1,199.00",
  },
];

/* =========================================================
   BOOK DATA
========================================================= */

const purchasedBooks: PurchasedBook[] = [
  {
    title: "Fundamental Engineering Mathematics",
    date: "Purchased on 12 May 2024",
    price: "Rs.299.00",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=120&q=80",
  },
  {
    title: "Data Structures & Algorithms",
    date: "Purchased on 05 May 2024",
    price: "Rs.399.00",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=120&q=80",
  },
  {
    title: "Digital Logic Design",
    date: "Purchased on 28 Apr 2024",
    price: "Rs.299.00",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80",
  },
  {
    title: "Operating Systems Concepts",
    date: "Purchased on 20 Apr 2024",
    price: "Rs.299.00",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=120&q=80",
  },
  {
    title: "Computer Networks",
    date: "Purchased on 15 Apr 2024",
    price: "Rs.399.00",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=120&q=80",
  },
];

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
  const [selectedStudentId, setSelectedStudentId] = useState(1);

  const [statusFilter, setStatusFilter] = useState<
    "All Status" | StudentStatus
  >("All Status");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const totalStudents = 1850;
  const totalPages = 265;
  const pageSize = 7;

  /* =======================================================
     SELECTED STUDENT
  ======================================================= */

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ??
    students[0];

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
  }, [statusFilter, search]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const goToPage = (newPage: number) => {
    const safePage = Math.max(1, Math.min(totalPages, newPage));

    setPage(safePage);
  };

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
              1,850
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
              1,240
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
              32
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
              Rs.4,50,000
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

              <button
                type="button"
                className="student-more-button"
                aria-label="More options"
              >
                <MoreVertical size={18} />
              </button>
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

                  <th className="action-column"></th>
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

                    <td>
                      <button
                        type="button"
                        className="row-more-button"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
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

                <div className="profile-contact">
                  <Mail size={12} />

                  <span>
                    {selectedStudent.email}
                  </span>
                </div>
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
              <span>Last Active</span>

              <strong>
                {selectedStudent.lastActive}
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
              {purchasedBooks.map((book) => (
                <div
                  className="purchased-book"
                  key={book.title}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                  />

                  <div className="purchased-book-info">
                    <strong>{book.title}</strong>

                    <span>{book.date}</span>
                  </div>

                  <span className="book-price">
                    {book.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ONLY BAN BUTTON */}
          {/* View Full History removed */}

          <div className="student-profile-actions">
            <button
              type="button"
              className="ban-student-button"
            >
              <UserRound size={16} />

              Ban Student
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}