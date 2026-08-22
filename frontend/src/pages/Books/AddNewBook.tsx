import {
  CheckCircle2,
  ChevronDown,
  FolderOpen,
  Upload,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./AddNewBook.css";

/* =========================================================
   TYPES
   ========================================================= */

type FormErrors = Partial<Record<string, string>>;

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
      className={`toggle ${value ? "active" : ""}`}
      onClick={() => onChange(!value)}
    >
      <span />
    </button>
  );
}

/* =========================================================
   FILE DROP ZONE
   ========================================================= */

function DropZone({
  accept,
  label,
  hint,
  file,
  preview,
  onFile,
  onClear,
  error,
}: {
  accept: string;
  label: string;
  hint: string;
  file: File | null;
  preview: string | null;
  onFile: (f: File) => void;
  onClear: () => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  return (
    <div className="upload-card">
      <div>
        <strong>
          {label} <span>*</span>
        </strong>
        <p>{hint}</p>
      </div>

      <div className="upload-area">
        {/* PREVIEW */}
        {preview ? (
          <div className="upload-preview-wrap">
            {accept.includes("image") ? (
              <img
                src={preview}
                alt="cover"
                className="cover-preview-img"
              />
            ) : (
              <div className="pdf-preview">
                <FileText size={28} />
                <span>{file?.name}</span>
              </div>
            )}
            <button
              type="button"
              className="clear-upload"
              onClick={onClear}
              title="Remove"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div
            className={`drop-area ${dragging ? "dragging" : ""} ${error ? "drop-error" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <Upload size={25} />
            <span>Drag and drop here</span>
            <small>or</small>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              {accept.includes("image") ? "Upload Cover" : "Upload PDF"}
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="field-error">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const MAX_DESC = 500;

export default function AddNewBook() {
  const navigate = useNavigate();

  /* -------------------------------------------------------
     FORM STATE
  ------------------------------------------------------- */

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  /* uploads */
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  /* settings */
  const [allowPreview, setAllowPreview] = useState(true);
  const [previewPages, setPreviewPages] = useState(10);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [recommended, setRecommended] = useState(false);

  /* ui */
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  /* -------------------------------------------------------
     COVER UPLOAD
  ------------------------------------------------------- */

  const handleCoverFile = (f: File) => {
    setCoverFile(f);
    const url = URL.createObjectURL(f);
    setCoverPreview(url);
    setErrors((prev) => ({ ...prev, cover: undefined }));
  };

  const clearCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
  };

  /* -------------------------------------------------------
     PDF UPLOAD
  ------------------------------------------------------- */

  const handlePdfFile = (f: File) => {
    setPdfFile(f);
    setPdfPreview(f.name);
    setErrors((prev) => ({ ...prev, pdf: undefined }));
  };

  const clearPdf = () => {
    setPdfFile(null);
    setPdfPreview(null);
  };

  /* -------------------------------------------------------
     VALIDATION
  ------------------------------------------------------- */

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!title.trim()) e.title = "Book title is required.";
    if (!author.trim()) e.author = "Author is required.";
    if (!price || Number(price) <= 0) e.price = "Enter a valid price.";
    if (!description.trim()) e.description = "Description is required.";
    if (!coverFile) e.cover = "Book cover is required.";
    if (!pdfFile) e.pdf = "Ebook PDF is required.";
    return e;
  };

  /* -------------------------------------------------------
     SUBMIT
  ------------------------------------------------------- */

  const handleSave = (isDraft = false) => {
    const e = validate();

    if (!isDraft && Object.keys(e).length > 0) {
      setErrors(e);
      // scroll to first error
      const first = document.querySelector(".field-error");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitted(true);

    // Simulate save — replace with real API call
    console.log("Saving book", {
      title, author, isbn, publisher, price,
      language, description, tags,
      coverFile, pdfFile,
      allowPreview, previewPages,
      featured, published, recommended,
      isDraft,
    });

    setTimeout(() => {
      navigate("/category");
    }, 800);
  };

  /* -------------------------------------------------------
     REQUIRED FIELDS STATUS
  ------------------------------------------------------- */

  const requiredFields = [
    { label: "Book Title", done: !!title.trim() },
    { label: "Author", done: !!author.trim() },
    { label: "Price", done: !!price && Number(price) > 0 },
    { label: "Description", done: !!description.trim() },
    { label: "Book Cover", done: !!coverFile },
    { label: "Ebook PDF", done: !!pdfFile },
  ];

  const allDone = requiredFields.every((f) => f.done);

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="add-book-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="add-book-page-header">
        <div>
          <h1>Add New Book</h1>
          <p>Create a new ebook record.</p>
        </div>

        <div className="page-breadcrumb">
          <span>Books</span>
          <b>›</b>
          <span>Catalogue</span>
          <b>›</b>
          <strong>Add New Book</strong>
        </div>
      </div>


      <div className="add-book-layout">

        {/* ================= MAIN FORM ================= */}

        <main className="add-book-main">

          {/* BOOK INFORMATION */}

          <section className="form-section">
            <h2>1. Book Information</h2>

            <div className="form-grid">

              {/* TITLE */}
              <div className="form-field">
                <label>Book Title <span>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Physics for Class 11"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  className={errors.title ? "input-error" : ""}
                />
                {errors.title && (
                  <p className="field-error">
                    <AlertCircle size={11} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* AUTHOR */}
              <div className="form-field">
                <label>Author <span>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. R.D. Sharma"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setErrors((prev) => ({ ...prev, author: undefined }));
                  }}
                  className={errors.author ? "input-error" : ""}
                />
                {errors.author && (
                  <p className="field-error">
                    <AlertCircle size={11} />
                    {errors.author}
                  </p>
                )}
              </div>

              {/* ISBN */}
              <div className="form-field">
                <label>
                  ISBN / Book Code
                  <small>(Optional)</small>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISBN 978-93-12345-67-8"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>

              {/* PUBLISHER */}
              <div className="form-field">
                <label>
                  Publisher
                  <small>(Optional)</small>
                </label>
                <input
                  type="text"
                  placeholder="e.g. D.C. Pandey Publications"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </div>

              {/* PRICE */}
              <div className="form-field">
                <label>Price (₹) <span>*</span></label>
                <div className={`input-prefix ${errors.price ? "input-prefix-error" : ""}`}>
                  <span>₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="299"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setErrors((prev) => ({ ...prev, price: undefined }));
                    }}
                  />
                </div>
                {errors.price && (
                  <p className="field-error">
                    <AlertCircle size={11} />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* LANGUAGE */}
              <div className="form-field">
                <label>
                  Language
                  <small>(Optional)</small>
                </label>
                <div className="select-wrapper">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Gujarati</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="form-field full">
                <label>Description <span>*</span></label>
                <textarea
                  rows={4}
                  placeholder="Write a short description of this book..."
                  maxLength={MAX_DESC}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  className={errors.description ? "input-error" : ""}
                />
                <small className={`character-count ${description.length >= MAX_DESC ? "at-limit" : ""}`}>
                  {description.length} / {MAX_DESC} characters
                </small>
                {errors.description && (
                  <p className="field-error">
                    <AlertCircle size={11} />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* TAGS */}
              <div className="form-field full">
                <label>
                  Tags / Keywords
                  <small>(Optional)</small>
                </label>
                <input
                  type="text"
                  placeholder="e.g. physics, class 11, cbse, textbook"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

            </div>
          </section>


          {/* MEDIA UPLOADS */}

          <section className="form-section">
            <h2>2. Media Uploads</h2>

            <div className="upload-grid">

              <DropZone
                accept="image/jpeg,image/png,image/webp"
                label="Book Cover"
                hint="Recommended ratio 2:3. JPG, PNG up to 2MB."
                file={coverFile}
                preview={coverPreview}
                onFile={handleCoverFile}
                onClear={clearCover}
                error={errors.cover}
              />

              <DropZone
                accept="application/pdf"
                label="Ebook PDF"
                hint="PDF file up to 50MB."
                file={pdfFile}
                preview={pdfPreview}
                onFile={handlePdfFile}
                onClear={clearPdf}
                error={errors.pdf}
              />

            </div>
          </section>


          {/* SETTINGS */}

          <div className="book-settings-grid">

            <section className="settings-card">
              <h2>3. Preview Configuration</h2>

              <div className="setting-row">
                <span>Allow Preview</span>
                <Toggle value={allowPreview} onChange={setAllowPreview} />
              </div>

              {allowPreview && (
                <div className="setting-row">
                  <span>Preview Pages</span>
                  <div className="number-control">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPages((p) => Math.max(1, p - 1))
                      }
                    >
                      −
                    </button>
                    <span>{previewPages}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPages((p) => Math.min(100, p + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <small>Set number of pages users can preview.</small>
            </section>

            <section className="settings-card">
              <h2>4. Publishing Settings</h2>

              <div className="setting-row">
                <span>Featured Book</span>
                <Toggle value={featured} onChange={setFeatured} />
              </div>

              <div className="setting-row">
                <span>Published <b style={{ color: "#ef4444" }}>*</b></span>
                <Toggle value={published} onChange={setPublished} />
              </div>

              <div className="setting-row">
                <span>Recommended Book</span>
                <Toggle value={recommended} onChange={setRecommended} />
              </div>
            </section>

          </div>


          {/* ACTIONS */}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/category")}
            >
              Cancel
            </button>

            <div>
              <button
                type="button"
                className="draft-button"
                onClick={() => handleSave(true)}
                disabled={submitted}
              >
                Save Draft
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => handleSave(false)}
                disabled={submitted}
              >
                {submitted ? "Saving..." : "Save Book"}
              </button>
            </div>
          </div>

        </main>


        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="add-book-sidebar">

          {/* SELECTED FOLDER */}
          <div className="info-card">
            <div className="info-card-title">
              <h2>Selected Folder</h2>
              <div className="info-icon">
                <FolderOpen size={20} />
              </div>
            </div>

            <span className="info-label">Folder Path</span>
            <p>Home › School Books › CBSE › Class 11 › Science</p>

            <div className="info-row">
              <span>Subfolders</span>
              <strong>0</strong>
            </div>

            <div className="info-row">
              <span>Books in this folder</span>
              <strong>4</strong>
            </div>
          </div>

          {/* REQUIRED FIELDS */}
          <div className="info-card">
            <h2>Required Fields</h2>

            {requiredFields.map((item) => (
              <div
                className={`required-item ${item.done ? "done" : ""}`}
                key={item.label}
              >
                <CheckCircle2 size={16} />
                <span>{item.label}</span>
              </div>
            ))}

            {allDone && (
              <p className="all-done-note">
                ✓ All required fields filled!
              </p>
            )}
          </div>

          {/* TIPS */}
          <div className="info-card tips-card">
            <h2>Publishing Tips</h2>
            <ul>
              <li>Use a high-quality cover image (min. 800×1200 px).</li>
              <li>Keep description clear and informative.</li>
              <li>Enable Published to make the book visible to users.</li>
            </ul>
          </div>

          <div className="success-note">
            <CheckCircle2 size={17} />
            <span>
              Books will be visible to users only when Published is enabled.
            </span>
          </div>

        </aside>

      </div>
    </div>
  );
}
