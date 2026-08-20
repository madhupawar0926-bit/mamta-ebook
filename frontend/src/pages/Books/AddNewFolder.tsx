import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  Folder,
  Home,
  Layers3,
  Star,
} from "lucide-react";

import "./AddNewFolder.css";

export default function AddNewFolder() {
  return (
    <div className="add-folder-page">

      {/* HEADER */}

      <div className="add-folder-header">

        <div>
          <h1>
            Add New Folder
          </h1>

          <p>
            Create a new catalogue folder / category
          </p>
        </div>

        <div className="folder-breadcrumb-top">

          <span>
            Books
          </span>

          <b>›</b>

          <span>
            Catalogue
          </span>

          <b>›</b>

          <strong>
            Add New Folder
          </strong>

        </div>

      </div>


      <div className="add-folder-layout">


        {/* MAIN */}

        <main className="add-folder-main">

          <section className="folder-form-section">

            <h2>
              Add New Folder
            </h2>

            {/* LOCATION */}

            <div className="folder-block">

              <h3>
                1. Parent Location / Folder
              </h3>

              <p className="section-description">
                The new folder will be created inside the selected parent location.
              </p>

              <div className="parent-location">

                <div className="folder-path">

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

                  <strong>
                    Class 10
                  </strong>

                </div>

                <button className="change-parent-button">
                  <ArrowRight size={15} />
                  Change Parent
                </button>

              </div>

            </div>


            {/* FOLDER INFORMATION */}

            <div className="folder-block">

              <h3>
                2. Folder Information
              </h3>

              <div className="folder-form-grid">

                <div className="folder-field">

                  <label>
                    Folder Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter folder name"
                  />

                </div>


                <div className="folder-field">

                  <label>
                    Slug / Folder Code
                    <small>
                      (optional)
                    </small>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter slug or folder code"
                  />

                </div>


                <div className="folder-field">

                  <label>
                    Description
                    <small>
                      (optional)
                    </small>
                  </label>

                  <textarea
                    placeholder="Enter a short description of this folder..."
                    rows={4}
                  />

                </div>


                <div className="folder-field">

                  <label>
                    Folder Type <span>*</span>
                  </label>

                  <div className="folder-select">

                    <Folder size={16} />

                    <select defaultValue="Folder">

                      <option>
                        Folder
                      </option>

                      <option>
                        Category
                      </option>

                    </select>

                    <ChevronDown size={15} />

                  </div>


                  <label className="status-label">
                    Visibility / Status <span>*</span>
                  </label>

                  <div className="folder-select">

                    <Eye size={16} />

                    <select defaultValue="Published">

                      <option>
                        Published
                      </option>

                      <option>
                        Unpublished
                      </option>

                      <option>
                        Draft
                      </option>

                    </select>

                    <ChevronDown size={15} />

                  </div>

                </div>


                <div className="folder-field order-field">

                  <label>
                    Display Order <span>*</span>
                  </label>

                  <input
                    type="number"
                    defaultValue="0"
                  />

                </div>

              </div>

            </div>


            {/* OPTIONAL SETTINGS */}

            <div className="folder-block">

              <h3>
                3. Optional Settings
              </h3>

              <div className="optional-settings">


                <div className="optional-setting">

                  <div className="setting-icon green">
                    <Folder size={18} />
                  </div>

                  <div>
                    <strong>
                      Show in catalogue
                    </strong>

                    <span>
                      Display this folder in the public catalogue.
                    </span>
                  </div>

                  <button className="folder-toggle active">
                    <span />
                  </button>

                </div>


                <div className="optional-setting">

                  <div className="setting-icon blue">
                    <Layers3 size={18} />
                  </div>

                  <div>
                    <strong>
                      Allow direct books in this folder
                    </strong>

                    <span>
                      Allow books to be added directly to this folder.
                    </span>
                  </div>

                  <button className="folder-toggle">
                    <span />
                  </button>

                </div>


                <div className="optional-setting">

                  <div className="setting-icon yellow">
                    <Star size={18} />
                  </div>

                  <div>
                    <strong>
                      Featured Folder
                    </strong>

                    <span>
                      Highlight this folder in the catalogue.
                    </span>
                  </div>

                  <button className="folder-toggle">
                    <span />
                  </button>

                </div>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="folder-actions">

              <button className="folder-cancel">
                Cancel
              </button>

              <div>

                <button className="folder-draft">
                  Save Draft
                </button>

                <button className="folder-primary">
                  Create Folder
                </button>

              </div>

            </div>

          </section>

        </main>


        {/* RIGHT SIDE */}

        <aside className="add-folder-sidebar">

          {/* SELECTED PARENT */}

          <div className="folder-info-card">

            <div className="folder-info-title">

              <h2>
                Selected Parent
              </h2>

              <div className="folder-card-icon">
                <Folder size={19} />
              </div>

            </div>

            <span className="folder-info-label">
              Folder Path
            </span>

            <p>
              Home › School Books ›
              <br />
              CBSE › Class 10
            </p>

            <div className="folder-stat">
              <span>
                Subfolders in this location
              </span>

              <strong>
                12
              </strong>
            </div>

            <div className="folder-stat">
              <span>
                Books in this location
              </span>

              <strong>
                46
              </strong>
            </div>

            <button className="change-parent-link">
              Change Parent
              <ArrowRight size={15} />
            </button>

          </div>


          {/* REQUIRED */}

          <div className="folder-info-card">

            <h2>
              Required Fields
            </h2>

            <div className="folder-required">
              <CheckCircle2 size={16} />
              <span>
                Parent Location
              </span>
            </div>

            <div className="folder-required">
              <CheckCircle2 size={16} />
              <span>
                Folder Name
              </span>
            </div>

            <div className="folder-required">
              <CheckCircle2 size={16} />
              <span>
                Display Order
              </span>
            </div>

          </div>


          {/* TIPS */}

          <div className="folder-info-card">

            <h2>
              Folder Management Tips
            </h2>

            <ul className="folder-tips">

              <li>
                Organize folders logically for easy navigation.
              </li>

              <li>
                Use clear and descriptive folder names.
              </li>

              <li>
                Set display order to control the sequence.
              </li>

              <li>
                Hide folders that are not ready for public view.
              </li>

            </ul>

          </div>

        </aside>

      </div>

    </div>
  );
}