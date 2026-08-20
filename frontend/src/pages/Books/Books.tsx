import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Folder,
  FolderOpen,
  Home,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Move,
  LayoutGrid,
  X,
} from "lucide-react";

import {
  rootFolder,
  type Book,
  type BookFolder,
} from "./booksData";

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
};


function TreeNode({
  folder,
  level,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
}: TreeNodeProps) {

  const hasChildren =
    (folder.children?.length ?? 0) > 0;

  const isExpanded =
    expandedIds.has(folder.id);

  const isSelected =
    selectedId === folder.id;

  return (
    <div className="tree-node">

      <div
        className={`tree-row ${
          isSelected ? "selected" : ""
        }`}
        style={{
          paddingLeft: `${12 + level * 24}px`,
        }}
        onClick={() => onSelect(folder.id)}
      >

        <button
          type="button"
          className={`tree-chevron ${
            !hasChildren ? "empty" : ""
          }`}
          onClick={(event) => {

            event.stopPropagation();

            if (hasChildren) {
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

      </div>


      {isExpanded && hasChildren && (
        <div className="tree-children">

          {folder.children!.map((child) => (

            <TreeNode
              key={child.id}
              folder={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />

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

  const visibleFolders = useMemo(() => {

    const folders =
      selectedFolder.children ?? [];

    return folders.filter((folder) => {

      const matchesSearch =
        folder.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        folder.status === statusFilter;

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
 <div className="books-tabs">

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

      </div>
       


        <div className="books-header-actions">

          <Link
  to="/books/addnewbook"
  className="add-book-button"
>
  <Plus size={17} />
  Add New Book
</Link>

<Link
  to="/books/folders/new"
  className="add-folder-button"
>
  <Plus size={17} />
  Add Folder
</Link>

        </div>

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

          <div className="breadcrumb-card">

            <div className="breadcrumb">

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

          <div className="catalogue-table-card">

            <div className="table-scroll">

              <table className="catalogue-table">

                <thead>

                  <tr>

                    <th>Name</th>

                    <th>Type</th>

                    <th>Subfolders</th>

                    <th>Books</th>

                    <th>Status</th>

                    <th>Sort Order</th>

                    <th>Updated At</th>

                    <th>Actions</th>

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

                            <span>
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

          </div>


          {/* ===============================================
              BOOKS + SUMMARY
              =============================================== */}

          <div className="books-bottom-grid">


            {/* =============================================
                BOOKS
                ============================================= */}

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


                    {visibleBooks.length === 0 && (
                      <tr>

                        <td
                          colSpan={7}
                          className="empty-state"
                        >
                          No books in this folder.
                        </td>

                      </tr>
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


            {/* =============================================
                SUMMARY
                ============================================= */}

            <aside className="folder-summary">

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

            <strong>
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