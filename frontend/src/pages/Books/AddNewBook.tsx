import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FolderOpen,
  Home,
  Pencil,
  Upload,
} from "lucide-react";

import "./AddNewBook.css";

export default function AddNewBook() {
  return (
    <div className="add-book-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="add-book-page-header">

        <div>
          <h1>
            Add New Book
          </h1>

          <p>
            Create a new ebook record.
          </p>
        </div>

        <div className="page-breadcrumb">

          <span>
            Books
          </span>

          <b>›</b>

          <span>
            All Books
          </span>

          <b>›</b>

          <strong>
            Add New Book
          </strong>

        </div>

      </div>


      <div className="add-book-layout">


        {/* ================= MAIN FORM ================= */}

        <main className="add-book-main">


          {/* LOCATION */}

          <section className="form-section">

            <h2>
              1. Book Location / Folder
            </h2>

            <div className="location-row">

              <div className="folder-breadcrumb">

                <button>
                  <Home size={15} />
                </button>

                <span>
                  Home
                </span>

                <b>›</b>

                <span>
                  School Books
                </span>

                <b>›</b>

                <span>
                  CBSE
                </span>

                <b>›</b>

                <span>
                  Class 10
                </span>

                <b>›</b>

                <strong>
                  Science
                </strong>

              </div>

              <button className="outline-action">
                <Pencil size={15} />
                Change Location
              </button>

            </div>

          </section>


          {/* BOOK INFORMATION */}

          <section className="form-section">

            <h2>
              2. Book Information
            </h2>

            <div className="form-grid">

              <div className="form-field">

                <label>
                  Book Title <span>*</span>
                </label>

                <input
                  type="text"
                  defaultValue="Physics for Class 10"
                />

              </div>


              <div className="form-field">

                <label>
                  Author <span>*</span>
                </label>

                <input
                  type="text"
                  defaultValue="R.D. Sharma"
                />

              </div>


              <div className="form-field">

                <label>
                  ISBN / Book Code
                  <small>
                    (Optional)
                  </small>
                </label>

                <input
                  type="text"
                  defaultValue="ISBN 978-93-12345-67-8"
                />

              </div>


              <div className="form-field">

                <label>
                  Publisher
                  <small>
                    (Optional)
                  </small>
                </label>

                <input
                  type="text"
                  defaultValue="D.C. Pandey Publications"
                />

              </div>


              <div className="form-field">

                <label>
                  Price (₹) <span>*</span>
                </label>

                <div className="input-prefix">
                  <span>₹</span>

                  <input
                    type="number"
                    defaultValue="299"
                  />
                </div>

              </div>


              <div className="form-field">

                <label>
                  Language
                  <small>
                    (Optional)
                  </small>
                </label>

                <div className="select-wrapper">

                  <select defaultValue="English">

                    <option>
                      English
                    </option>

                    <option>
                      Hindi
                    </option>

                    <option>
                      Marathi
                    </option>

                  </select>

                  <ChevronDown size={15} />

                </div>

              </div>


              <div className="form-field full">

                <label>
                  Description <span>*</span>
                </label>

                <textarea
                  defaultValue="A complete Physics textbook for CBSE Class 10 students. Covers all chapters with clear explanations, diagrams, solved examples and practice questions."
                  rows={4}
                />

                <small className="character-count">
                  136 / 500 characters
                </small>

              </div>


              <div className="form-field full">

                <label>
                  Tags / Keywords
                  <small>
                    (Optional)
                  </small>
                </label>

                <input
                  type="text"
                  defaultValue="physics, class 10, cbse, textbook, revision"
                />

              </div>

            </div>

          </section>


          {/* MEDIA */}

          <section className="form-section">

            <h2>
              3. Media Uploads
            </h2>

            <div className="upload-grid">


              <div className="upload-card">

                <div>
                  <strong>
                    Book Cover <span>*</span>
                  </strong>

                  <p>
                    Recommended ratio 2:3. JPG, PNG up to 2MB.
                  </p>
                </div>

                <div className="upload-area">

                  <div className="fake-cover">
                    PHYSICS
                  </div>

                  <div className="drop-area">

                    <Upload size={25} />

                    <span>
                      Drag and drop image here
                    </span>

                    <small>
                      or
                    </small>

                    <button>
                      Upload Cover
                    </button>

                  </div>

                </div>

              </div>


              <div className="upload-card">

                <div>
                  <strong>
                    Ebook PDF <span>*</span>
                  </strong>

                  <p>
                    PDF file up to 50MB.
                  </p>
                </div>

                <div className="upload-area">

                  <div className="pdf-preview">
                    PDF
                  </div>

                  <div className="drop-area">

                    <Upload size={25} />

                    <span>
                      Drag and drop PDF here
                    </span>

                    <small>
                      or
                    </small>

                    <button>
                      Upload PDF
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* SETTINGS */}

          <div className="book-settings-grid">

            <section className="settings-card">

              <h2>
                4. Preview Configuration
              </h2>

              <div className="setting-row">

                <span>
                  Allow Preview
                </span>

                <button className="toggle active">
                  <span />
                </button>

              </div>

              <div className="setting-row">

                <span>
                  Preview Pages
                </span>

                <div className="number-control">
                  <button>−</button>
                  <span>10</span>
                  <button>+</button>
                </div>

              </div>

              <small>
                Set number of pages users can preview.
              </small>

            </section>


            <section className="settings-card">

              <h2>
                5. Publishing Settings
              </h2>

              <div className="setting-row">
                <span>
                  Featured Book
                </span>

                <button className="toggle">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <span>
                  Published *
                </span>

                <button className="toggle active">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <span>
                  Recommended Book
                </span>

                <button className="toggle">
                  <span />
                </button>
              </div>

            </section>

          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <button className="cancel-button">
              Cancel
            </button>

            <div>

              <button className="draft-button">
                Save Draft
              </button>

              <button className="primary-button">
                Save Book
              </button>

            </div>

          </div>

        </main>


        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="add-book-sidebar">

          <div className="info-card">

            <div className="info-card-title">
              <h2>
                Selected Folder
              </h2>

              <div className="info-icon">
                <FolderOpen size={20} />
              </div>
            </div>

            <span className="info-label">
              Folder Path
            </span>

            <p>
              Home › School Books ›
              <br />
              CBSE › Class 10 › Science
            </p>

            <div className="info-row">
              <span>
                Subfolders
              </span>

              <strong>
                0
              </strong>
            </div>

            <div className="info-row">
              <span>
                Books in this folder
              </span>

              <strong>
                18
              </strong>
            </div>

            <button className="text-action">
              Change Location
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="info-card">

            <h2>
              Required Fields
            </h2>

            {[
              "Book Title",
              "Author",
              "Price",
              "Description",
              "Book Cover",
              "Ebook PDF",
            ].map((item) => (

              <div
                className="required-item"
                key={item}
              >
                <CheckCircle2 size={16} />

                <span>
                  {item}
                </span>
              </div>

            ))}

          </div>


          <div className="info-card tips-card">

            <h2>
              Publishing Tips
            </h2>

            <ul>

              <li>
                Use a high-quality cover image
                (min. 800×1200 px).
              </li>

              <li>
                Keep description clear and informative.
              </li>

              <li>
                Enable Published to make the book visible to users.
              </li>

            </ul>

          </div>


          <div className="success-note">
            <CheckCircle2 size={17} />

            <span>
              Books will be visible to users
              only when Published is enabled.
            </span>
          </div>

        </aside>

      </div>

    </div>
  );
}