import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Folder,
  FolderOpen,
  BookOpen,
  Home,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Move,
  LayoutGrid,
  X,
} from "lucide-react";

import {
  type Book,
  type BookFolder,
} from "./booksData";

import { useBooksContext } from "../../context/BooksContextValue";

import "./Books.css";

/* =========================================================
   HELPERS
   ========================================================= */

function findFolder(
  folder: BookFolder,
  id: string
): BookFolder | null {
  if (folder.id === id) {
    return folder;
  }

  for (const child of folder.children ?? []) {
    const result = findFolder(child, id);

    if (result) {
      return result;
    }
  }

  return null;
}

function findPath(
  folder: BookFolder,
  id: string,
  currentPath: BookFolder[] = []
): BookFolder[] | null {
  const nextPath = [
    ...currentPath,
    folder,
  ];

  if (folder.id === id) {
    return nextPath;
  }

  for (const child of folder.children ?? []) {
    const result = findPath(
      child,
      id,
      nextPath
    );

    if (result) {
      return result;
    }
  }

  return null;
}

function countSubfolders(
  folder: BookFolder
): number {
  let count = folder.children?.length ?? 0;

  for (const child of folder.children ?? []) {
    count += countSubfolders(child);
  }

  return count;
}

function countDirectBooks(
  folder: BookFolder
): number {
  return folder.books?.length ?? 0;
}

type FolderType =
  | "root"
  | "has-folders"
  | "has-books"
  | "empty";

function getFolderType(
  folder: BookFolder
): FolderType {
  if (folder.id === "root") return "root";
  if ((folder.children?.length ?? 0) > 0) return "has-folders";
  if ((folder.books?.length ?? 0) > 0) return "has-books";
  return "empty";
}

function countAllBooks(
  folder: BookFolder
): number {
  let count = folder.books?.length ?? 0;

  for (const child of folder.children ?? []) {
    count += countAllBooks(child);
  }

  return count;
}

/* =========================================================
   TREE NODE
   ========================================================= */

type TreeNodeProps = {
  folder: BookFolder;
  level: number;
  selectedId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function TreeNode({
  folder,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
}: TreeNodeProps) {
  const hasChildren =
    (folder.children?.length ?? 0) > 0;

  const hasBooks =
    (folder.books?.length ?? 0) > 0;

  const hasTreeItems =
    hasChildren || hasBooks;

  const isExpanded =
    expandedIds.has(folder.id);

  const isSelected =
    selectedId === folder.id;

  /*
   * IMPORTANT:
   * Keep indentation controlled even when there are
   * many nested folders.
   *
   * 8px = base padding
   * 18px = indentation per level
   * 5 = maximum visual indentation levels
   *
   * This prevents the tree from continuously moving
   * towards the right when more folders are added.
   */
  const visualLevel = Math.min(level, 5);

  const folderPadding =
    8 + visualLevel * 18;

  const bookPadding =
    8 + Math.min(level + 1, 5) * 18;

  return (
    <div className="tree-node">
      {/* =========================
          FOLDER ROW
      ========================= */}

      <div
        className={`tree-row ${
          isSelected ? "selected" : ""
        }`}
        style={{
          paddingLeft: `${folderPadding}px`,
        }}
        onClick={() => onSelect(folder.id)}
      >
        <button
          type="button"
          className={`tree-chevron ${
            !hasTreeItems ? "empty" : ""
          }`}
          onClick={(event) => {
            event.stopPropagation();

            if (hasTreeItems) {
              onToggle(folder.id);
            }
          }}
          aria-label={
            isExpanded
              ? "Collapse folder"
              : "Expand folder"
          }
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span />
          )}
        </button>

        <span className="tree-folder-icon">
          {isExpanded ? (
            <FolderOpen size={16} />
          ) : (
            <Folder size={16} />
          )}
        </span>

        <span className="tree-folder-name">
          {folder.name}
        </span>

        {folder.id !== "root" && (
          <span className="tree-folder-actions">
            <button
              type="button"
              title="Edit folder"
              aria-label={`Edit ${folder.name}`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(folder.id);
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              title="Delete folder"
              aria-label={`Delete ${folder.name}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(folder.id);
              }}
            >
              <Trash2 size={13} />
            </button>
          </span>
        )}
      </div>

      {/* =========================
          CHILDREN
      ========================= */}

      {isExpanded && hasTreeItems && (
        <div className="tree-children">
          {/* =========================
              CHILD FOLDERS
          ========================= */}

          {folder.children
            ?.map((child) => (
              <TreeNode
                key={child.id}
                folder={child}
                level={level + 1}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onToggle={onToggle}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

          {/* =========================
              BOOKS
          ========================= */}

          {folder.books?.map((book) => (
            <div
              key={`book-${book.id}`}
              className="tree-row tree-book-row"
              style={{
                paddingLeft: `${bookPadding}px`,
              }}
              title={book.title}
            >
              <span className="tree-chevron empty">
                <span />
              </span>

              <span className="tree-book-icon">
                <BookOpen size={15} />
              </span>

              <span className="tree-folder-name tree-book-name">
                {book.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export function Books() {
  const navigate = useNavigate();
  const {
    root: rootFolder,
    deleteFolder,
  } = useBooksContext();

  const [selectedFolderId, setSelectedFolderId] =
    useState("science");

  const [expandedIds, setExpandedIds] =
    useState<Set<string>>(
      new Set([
        "root",
        "school-books",
        "cbse",
        "class-11",
        "science",
      ])
    );

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [mobileTreeOpen, setMobileTreeOpen] =
    useState(false);

  /* =======================================================
     SELECTED FOLDER
     ======================================================= */

  const selectedFolder = useMemo(() => {
    return (
      findFolder(
        rootFolder,
        selectedFolderId
      ) ?? rootFolder
    );
  }, [selectedFolderId]);

  /* =======================================================
     BREADCRUMB
     ======================================================= */

  const breadcrumb = useMemo(() => {
    return (
      findPath(
        rootFolder,
        selectedFolderId
      ) ?? [rootFolder]
    );
  }, [selectedFolderId]);

  /* =======================================================
     FOLDER FILTER
     ======================================================= */

  // const visibleFolders = useMemo(() => {
  //   const folders =
  //     selectedFolder.children ?? [];

  //   return folders.filter((folder) => {
  //     const matchesSearch =
  //       folder.name
  //         .toLowerCase()
  //         .includes(search.toLowerCase());

  //     const matchesStatus =
  //       statusFilter === "All" ||
  //       folder.status === statusFilter;

  //     return (
  //       matchesSearch &&
  //       matchesStatus
  //     );
  //   });
  // }, [
  //   selectedFolder,
  //   search,
  //   statusFilter,
  // ]);

  /* =======================================================
     BOOK FILTER
     ======================================================= */

  const visibleBooks = useMemo(() => {
    const folderBooks =
      selectedFolder.books ?? [];

    return folderBooks.filter((book) => {
      const matchesSearch =
        `${book.title} ${book.author} ${book.code}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        book.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    selectedFolder,
    search,
    statusFilter,
  ]);

  /* =======================================================
     TOGGLE TREE
     ======================================================= */

  const toggleFolder = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /* =======================================================
     SELECT FOLDER
     ======================================================= */

  const selectFolder = (id: string) => {
    setSelectedFolderId(id);

    setMobileTreeOpen(false);

    setExpandedIds((previous) => {
      const next = new Set(previous);

      const path =
        findPath(rootFolder, id);

      path?.forEach((folder) => {
        next.add(folder.id);
      });

      return next;
    });
  };

  const editFolder = (id: string) => {
    navigate(`/category/folders/new?editId=${encodeURIComponent(id)}`);
  };

  const removeFolder = (id: string) => {
    const folder = findFolder(rootFolder, id);
    if (!folder || !window.confirm(`Delete folder "${folder.name}" and everything inside it?`)) {
      return;
    }

    const path = findPath(rootFolder, id);
    const parent = path && path.length > 1 ? path[path.length - 2] : rootFolder;
    deleteFolder(id);

    if (selectedFolderId === id || path?.some((item) => item.id === selectedFolderId)) {
      setSelectedFolderId(parent.id);
    }
  };

  /* =======================================================
     SUMMARY
     ======================================================= */

  const directBooks =
    countDirectBooks(selectedFolder);

  const totalBooks =
    countAllBooks(selectedFolder);

  const totalSubfolders =
    countSubfolders(selectedFolder);

  return (
    <div className="books-page">

      {/* ===================================================
          PAGE HEADER
          =================================================== */}

      <div className="books-page-header">
        {/* <div className="books-tabs">

          <button
            type="button"
            className="books-tab active"
          >
            Catalogue
          </button>

          <button
            type="button"
            className="books-tab"
          >
            All Books
          </button>

        </div> */}

        <div className="books-header-actions-placeholder" />
      </div>

      {/* ===================================================
          TABS
          =================================================== */}

      {/* ===================================================
          MOBILE TREE BUTTON
          =================================================== */}

      <button
        type="button"
        className="mobile-catalogue-button"
        onClick={() =>
          setMobileTreeOpen(true)
        }
      >
        <LayoutGrid size={16} />

        Catalogue Structure

        <ChevronRight size={16} />
      </button>

      <div className="books-layout">

        {/* =================================================
            LEFT TREE
            ================================================= */}

        <aside
          className={`catalogue-panel ${
            mobileTreeOpen
              ? "mobile-open"
              : ""
          }`}
        >
          <div className="catalogue-header">
            <strong>
              Catalogue Structure
            </strong>

            <button
              type="button"
              className="catalogue-collapse"
              onClick={() =>
                setMobileTreeOpen(false)
              }
            >
              <ChevronUp size={16} />
            </button>
          </div>

          <div className="catalogue-tree">
            <TreeNode
              folder={rootFolder}
              level={0}
              selectedId={selectedFolderId}
              expandedIds={expandedIds}
              onToggle={toggleFolder}
              onSelect={selectFolder}
              onEdit={editFolder}
              onDelete={removeFolder}
            />
          </div>
        </aside>

        {/* =================================================
            RIGHT CONTENT
            ================================================= */}

        <main className="books-content">

          {/* ===============================================
              BREADCRUMB
              =============================================== */}

          <div
            className="breadcrumb-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              className="breadcrumb"
              style={{
                minWidth: 0,
                flex: "1 1 auto",
              }}
            >
              {breadcrumb.map(
                (folder, index) => {
                  const isLast =
                    index ===
                    breadcrumb.length - 1;

                  return (
                    <div
                      className="breadcrumb-item"
                      key={folder.id}
                    >
                      {index === 0 ? (
                        <Home size={15} />
                      ) : null}

                      {index !== 0 && (
                        <ChevronRight
                          size={14}
                          className="breadcrumb-arrow"
                        />
                      )}

                      <button
                        type="button"
                        className={
                          isLast
                            ? "current"
                            : ""
                        }
                        onClick={() =>
                          selectFolder(
                            folder.id
                          )
                        }
                      >
                        {folder.name}
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            <div
              className="books-header-actions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexShrink: 0,
              }}
            >
              {(() => {
                const type = getFolderType(selectedFolder);

                const showBook =
                  type === "has-books" ||
                  type === "empty";

                const showFolder =
                  type === "root" ||
                  type === "has-folders" ||
                  type === "empty";

                return (
                  <>
                    {showBook && (
                      <Link
                        to="/category/addnewbook"
                        className="add-book-button"
                      >
                        <Plus size={17} />
                        Add New Book
                      </Link>
                    )}

                    {showFolder && (
                      <Link
                        to={`/category/folders/new?parentId=${selectedFolderId}`}
                        className="add-folder-button"
                      >
                        <Plus size={17} />
                        Add Folder
                      </Link>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* ===============================================
              SEARCH / FILTER BAR
              =============================================== */}

          <div className="catalogue-toolbar">

            <div className="catalogue-search">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search folders or books..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="status-filter">
              <SlidersHorizontal
                size={15}
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  Status: All
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Unpublished">
                  Unpublished
                </option>
              </select>

              <ChevronDown size={14} />
            </div>

            <div className="toolbar-actions">
              <button
                type="button"
                className="outline-action"
              >
                <ArrowUpDown size={15} />
                Reorder
              </button>

              <button
                type="button"
                className="outline-action"
              >
                <Move size={15} />
                Move
              </button>
            </div>
          </div>

          {/* ===============================================
              FOLDER TABLE
              =============================================== */}

          {/* <div className="catalogue-table-card">

            <div className="table-scroll">

              <table className="catalogue-table">

                <thead>

                  <tr>

                    <th style={{ minWidth: "230px" }}>
                      Name
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Subfolders
                    </th>

                    <th>
                      Books
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Sort Order
                    </th>

                    <th>
                      Updated At
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {visibleFolders.map(
                    (folder) => (

                      <tr
                        key={folder.id}
                        className="folder-table-row"
                        onDoubleClick={() =>
                          selectFolder(
                            folder.id
                          )
                        }
                      >

                        <td>

                          <button
                            type="button"
                            className="table-name-button"
                            onClick={() =>
                              selectFolder(
                                folder.id
                              )
                            }
                          >

                            <Folder
                              size={20}
                              className="table-folder-icon"
                            />

                            <span
                              className="table-name-text"
                              style={{
                                whiteSpace: "normal",
                                overflow: "visible",
                                textOverflow: "clip",
                                wordBreak: "break-word",
                                lineHeight: 1.35,
                              }}
                            >
                              {folder.name}
                            </span>

                          </button>

                        </td>

                        <td>
                          <span className="type-text">
                            Folder
                          </span>
                        </td>

                        <td>
                          {folder.children?.length ?? 0}
                        </td>

                        <td>
                          {countDirectBooks(folder)}
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              folder.status
                            }
                          />
                        </td>

                        <td>
                          {folder.sortOrder}
                        </td>

                        <td>
                          {folder.updatedAt}
                        </td>

                        <td>

                          <div className="row-actions">

                            <button
                              type="button"
                              title="Open"
                              onClick={() =>
                                selectFolder(
                                  folder.id
                                )
                              }
                            >
                              <ChevronRight
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              title="More"
                            >
                              <MoreVertical
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                  {visibleFolders.length === 0 && (
                    <tr>

                      <td
                        colSpan={8}
                        className="empty-state"
                      >
                        No folders found.
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div> */}

          {/* ===============================================
              BOOKS + SUMMARY
              =============================================== */}

          <div
            className="books-bottom-grid"
            style={{
              gridTemplateColumns:
                visibleBooks.length > 0
                  ? undefined
                  : "minmax(0, 1fr)",
            }}
          >
            {visibleBooks.length > 0 && (
              <div className="folder-books-card">

                <div className="folder-books-header">
                  <h2>
                    Books in this folder{" "}
                    <span>
                      ({visibleBooks.length})
                    </span>
                  </h2>
                </div>

                <div className="table-scroll">
                  <table className="folder-books-table">

                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Purchases</th>
                        <th>Status</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleBooks.map(
                        (book) => (
                          <BookRow
                            key={book.id}
                            book={book}
                          />
                        )
                      )}
                    </tbody>

                  </table>
                </div>

                <button
                  type="button"
                  className="view-books-button"
                >
                  View all books in this folder
                  <ChevronRight size={16} />
                </button>

              </div>
            )}

            <aside
              className="folder-summary"
              style={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <div className="summary-title">

                <h2>
                  Selected Folder Summary
                </h2>

                <span className="summary-folder-icon">
                  <Folder size={17} />
                </span>

              </div>

              <SummaryItem
                label="Total Subfolders"
                value={String(
                  selectedFolder.children
                    ?.length ?? 0
                )}
              />

              <SummaryItem
                label="Direct Books"
                value={String(
                  directBooks
                )}
              />

              <SummaryItem
                label="Total Books in Subtree"
                value={String(
                  totalBooks
                )}
              />

              <SummaryItem
                label="Total Subfolders in Subtree"
                value={String(
                  totalSubfolders
                )}
              />

              <div className="summary-divider" />

              <SummaryItem
                label="Last Updated"
                value={
                  selectedFolder.updatedAt
                }
              />

              <div className="summary-visibility">
                <span>
                  Visibility
                </span>

                <StatusBadge
                  status={
                    selectedFolder.status
                  }
                />
              </div>
            </aside>
          </div>

        </main>
      </div>
    </div>
  );
}

/* =========================================================
   BOOK ROW
   ========================================================= */

function BookRow({
  book,
}: {
  book: Book;
}) {
  return (
    <tr>

      <td>
        <div className="book-table-info">

          <img
            src={book.image}
            alt={book.title}
          />

          <div>

            <strong
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <BookOpen size={15} />
              {book.title}
            </strong>

            <span>
              {book.code}
            </span>

          </div>

        </div>
      </td>

      <td>
        {book.author}
      </td>

      <td>
        ₹{book.price}
      </td>

      <td>
        {book.purchases.toLocaleString()}
      </td>

      <td>
        <StatusBadge
          status={book.status}
        />
      </td>

      <td>
        {book.updatedAt}
      </td>

      <td>
        <button
          type="button"
          className="book-more-button"
        >
          <MoreVertical size={16} />
        </button>
      </td>

    </tr>
  );
}

/* =========================================================
   STATUS
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: "Published" | "Unpublished";
}) {
  return (
    <span
      className={`status-badge ${
        status === "Published"
          ? "published"
          : "unpublished"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   SUMMARY ITEM
   ========================================================= */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="summary-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default Books;