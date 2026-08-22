import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Folder,
  Layers3,
  Star,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useBooksContext } from "../../context/BooksContextValue";
import { type BookFolder } from "./booksData";

import "./AddNewFolder.css";

/* =========================================================
   TOGGLE
   ========================================================= */

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`folder-toggle ${value ? "active" : ""}`}
      onClick={() => onChange(!value)}
    >
      <span />
    </button>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormErrors = Partial<Record<string, string>>;

/* =========================================================
   MAIN
   ========================================================= */

export default function AddNewFolder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { root, addFolder, updateFolder } = useBooksContext();

  const parentId = searchParams.get("parentId") ?? "root";
  const editId = searchParams.get("editId");

  function findFolder(folder: BookFolder, id: string): BookFolder | null {
    if (folder.id === id) return folder;
    for (const child of folder.children ?? []) {
      const result = findFolder(child, id);
      if (result) return result;
    }
    return null;
  }

  const editingFolder = editId ? findFolder(root, editId) : null;

  /* resolve parent folder path for display */
  function findPath(folder: BookFolder, id: string, path: BookFolder[] = []): BookFolder[] | null {
    const next = [...path, folder];
    if (folder.id === id) return next;
    for (const child of folder.children ?? []) {
      const result = findPath(child, id, next);
      if (result) return result;
    }
    return null;
  }

  const parentPath = findPath(root, parentId) ?? [root];
  const parentFolder = parentPath[parentPath.length - 1];
  const parentPathLabel = parentPath.map((f) => f.name).join(" › ");

  /* -------------------------------------------------------
     FORM STATE
  ------------------------------------------------------- */

  const [name, setName] = useState(editingFolder?.name ?? "");
  const [slug, setSlug] = useState(editingFolder?.id ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [folderType, setFolderType] = useState("Folder");
  const [status, setStatus] = useState<"Published" | "Unpublished">(
    editingFolder?.status ?? "Published"
  );
  const [displayOrder, setDisplayOrder] = useState(String(editingFolder?.sortOrder ?? 1));

  /* toggles */
  const [showInCatalogue, setShowInCatalogue] = useState(true);
  const [allowDirectBooks, setAllowDirectBooks] = useState(false);
  const [featured, setFeatured] = useState(false);

  /* ui */
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  /* -------------------------------------------------------
     AUTO SLUG
  ------------------------------------------------------- */

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManual) {
      setSlug(toSlug(value));
    }
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManual(true);
    setSlug(toSlug(value));
  };

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Folder name is required.";
    if (!displayOrder || Number(displayOrder) < 0)
      e.displayOrder = "Enter a valid display order.";
    return e;
  };

  /* -------------------------------------------------------
     SUBMIT
  ------------------------------------------------------- */

  const handleSave = (isDraft = false) => {
    const e = validate();

    if (!isDraft && Object.keys(e).length > 0) {
      setErrors(e);
      const first = document.querySelector(".folder-field-error");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const now = new Date();
    const formatted = now.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    }) + ", " + now.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

    const folder: BookFolder = {
      id: slug || `folder-${Date.now()}`,
      name,
      type: "folder",
      status: status === "Published" ? "Published" : "Unpublished",
      sortOrder: Number(displayOrder),
      updatedAt: formatted,
      children: editingFolder?.children ?? [],
    };

    if (editingFolder && editId) {
      updateFolder(editId, folder);
    } else {
      addFolder(parentId, folder);
    }

    setSubmitted(true);
    setTimeout(() => navigate("/category"), 400);
  };

  /* -------------------------------------------------------
     REQUIRED FIELDS STATUS
  ------------------------------------------------------- */

  const requiredFields = [
    { label: "Parent Location", done: true }, // always set (current folder)
    { label: "Folder Name", done: !!name.trim() },
    { label: "Display Order", done: !!displayOrder && Number(displayOrder) >= 0 },
  ];

  const allDone = requiredFields.every((f) => f.done);

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="add-folder-page">

      {/* HEADER */}

      <div className="add-folder-header">
        <div>
          <h1>{editingFolder ? "Edit Folder" : "Add New Folder"}</h1>
          <p>{editingFolder ? "Update this catalogue folder / category" : "Create a new catalogue folder / category"}</p>
        </div>

        <div className="folder-breadcrumb-top">
          <span>Books</span>
          <b>›</b>
          <span>Catalogue</span>
          <b>›</b>
            <strong>{editingFolder ? "Edit Folder" : "Add New Folder"}</strong>
        </div>
      </div>


      <div className="add-folder-layout">

        {/* ================= MAIN ================= */}

        <main className="add-folder-main">

          <section className="folder-form-section">

            <h2>{editingFolder ? "Edit Folder" : "Add New Folder"}</h2>

            {/* BLOCK 1 — FOLDER INFORMATION */}

            <div className="folder-block">
              <h3>1. Folder Information</h3>

              <div className="folder-form-grid">

                {/* NAME */}
                <div className="folder-field">
                  <label>Folder Name <span>*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Science"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={errors.name ? "folder-input-error" : ""}
                  />
                  {errors.name && (
                    <p className="folder-field-error">
                      <AlertCircle size={11} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* SLUG */}
                <div className="folder-field">
                  <label>
                    Slug / Folder Code
                    <small>(auto-generated)</small>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. science"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                  />
                  {slug && (
                    <small className="slug-preview">
                      /catalogue/{slug}
                    </small>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="folder-field folder-field-full">
                  <label>
                    Description
                    <small>(optional)</small>
                  </label>
                  <textarea
                    placeholder="Enter a short description of this folder..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* FOLDER TYPE */}
                <div className="folder-field">
                  <label>Folder Type <span>*</span></label>
                  <div className="folder-select">
                    <Folder size={15} />
                    <select
                      value={folderType}
                      onChange={(e) => setFolderType(e.target.value)}
                    >
                      <option>Folder</option>
                      <option>Category</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>

                {/* STATUS */}
                <div className="folder-field">
                  <label>Visibility / Status <span>*</span></label>
                  <div className="folder-select">
                    <Eye size={15} />
                    <select
                      value={status}
                      onChange={(e) => {
                        const nextStatus: "Published" | "Unpublished" =
                          e.target.value === "Published"
                            ? "Published"
                            : "Unpublished";
                        setStatus(nextStatus);
                      }}
                    >
                      <option>Published</option>
                      <option>Unpublished</option>
                      <option>Draft</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>

                {/* DISPLAY ORDER */}
                <div className="folder-field order-field">
                  <label>Display Order <span>*</span></label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => {
                      setDisplayOrder(e.target.value);
                      setErrors((prev) => ({ ...prev, displayOrder: undefined }));
                    }}
                    className={errors.displayOrder ? "folder-input-error" : ""}
                  />
                  {errors.displayOrder && (
                    <p className="folder-field-error">
                      <AlertCircle size={11} />
                      {errors.displayOrder}
                    </p>
                  )}
                </div>

              </div>
            </div>


            {/* BLOCK 2 — OPTIONAL SETTINGS */}

            <div className="folder-block">
              <h3>2. Optional Settings</h3>

              <div className="optional-settings">

                <div className="optional-setting">
                  <div className="setting-icon green">
                    <Folder size={18} />
                  </div>
                  <div>
                    <strong>Show in catalogue</strong>
                    <span>Display this folder in the public catalogue.</span>
                  </div>
                  <Toggle value={showInCatalogue} onChange={setShowInCatalogue} />
                </div>

                <div className="optional-setting">
                  <div className="setting-icon blue">
                    <Layers3 size={18} />
                  </div>
                  <div>
                    <strong>Allow direct books</strong>
                    <span>Allow books to be added directly to this folder.</span>
                  </div>
                  <Toggle value={allowDirectBooks} onChange={setAllowDirectBooks} />
                </div>

                <div className="optional-setting">
                  <div className="setting-icon yellow">
                    <Star size={18} />
                  </div>
                  <div>
                    <strong>Featured Folder</strong>
                    <span>Highlight this folder in the catalogue.</span>
                  </div>
                  <Toggle value={featured} onChange={setFeatured} />
                </div>

              </div>
            </div>


            {/* ACTIONS */}

            <div className="folder-actions">
              <button
                type="button"
                className="folder-cancel"
                onClick={() => navigate("/category")}
              >
                Cancel
              </button>

              <div>
                <button
                  type="button"
                  className="folder-draft"
                  onClick={() => handleSave(true)}
                  disabled={submitted}
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  className="folder-primary"
                  onClick={() => handleSave(false)}
                  disabled={submitted}
                >
                  {submitted ? "Creating..." : "Create Folder"}
                </button>
              </div>
            </div>

          </section>

        </main>


        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="add-folder-sidebar">

          {/* SELECTED PARENT */}
          <div className="folder-info-card">
            <div className="folder-info-title">
              <h2>Selected Parent</h2>
              <div className="folder-card-icon">
                <Folder size={19} />
              </div>
            </div>

            <span className="folder-info-label">Folder Path</span>
            <p>{parentPathLabel}</p>

            <div className="folder-stat">
              <span>Subfolders here</span>
              <strong>{parentFolder.children?.length ?? 0}</strong>
            </div>

            <div className="folder-stat">
              <span>Books here</span>
              <strong>{parentFolder.books?.length ?? 0}</strong>
            </div>
          </div>

          {/* REQUIRED FIELDS */}
          <div className="folder-info-card">
            <h2>Required Fields</h2>

            {requiredFields.map((item) => (
              <div
                key={item.label}
                className={`folder-required ${item.done ? "done" : ""}`}
              >
                <CheckCircle2 size={16} />
                <span>{item.label}</span>
              </div>
            ))}

            {allDone && (
              <p className="folder-all-done">
                ✓ All required fields filled!
              </p>
            )}
          </div>

          {/* TIPS */}
          <div className="folder-info-card">
            <h2>Folder Management Tips</h2>
            <ul className="folder-tips">
              <li>Organize folders logically for easy navigation.</li>
              <li>Use clear and descriptive folder names.</li>
              <li>Set display order to control the sequence.</li>
              <li>Hide folders that are not ready for public view.</li>
            </ul>
          </div>

        </aside>

      </div>

    </div>
  );
}
