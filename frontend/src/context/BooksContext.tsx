import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { db } from "../firebase";
import { type Book, type BookFolder } from "../pages/Books/booksData";
import { BooksContext, type NewBookData } from "./BooksContextValue";

type CategoryDocument = {
  name: string;
  parentId: string | null;
  path: string;
  type: "folder";
  visibility: "published" | "draft";
  sortOrder?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

type BookDocument = Omit<Book, "id" | "image" | "updatedAt" | "status"> & {
  categoryId: string;
  categoryPath?: string;
  status?: "Published" | "Unpublished";
  image?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

function formatTimestamp(value: unknown): string {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return "Not available";
  }

  const timestamp = value as { toDate: () => Date };
  const date = timestamp.toDate();

  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

function toFolder(id: string, data: CategoryDocument): BookFolder {
  const visibility = data.visibility ?? "published";

  return {
    id,
    name: data.name,
    type: "folder",
    status: visibility === "published" ? "Published" : "Unpublished",
    visibility,
    sortOrder: data.sortOrder ?? 0,
    updatedAt: formatTimestamp(data.updatedAt),
    children: [],
    books: [],
  };
}

function toBook(id: string, data: BookDocument): Book {
  return {
    id,
    title: data.title,
    code: data.isbn || id,
    author: data.author,
    price: data.price,
    purchases: data.purchases ?? 0,
    status: data.status ?? (data.published === false ? "Unpublished" : "Published"),
    updatedAt: formatTimestamp(data.updatedAt),
    image: data.image ?? "",
    categoryId: data.categoryId,
    categoryPath: data.categoryPath,
    isbn: data.isbn,
    language: data.language,
    description: data.description,
    tags: data.tags,
    allowPreview: data.allowPreview,
    previewPages: data.previewPages,
    featured: data.featured,
    recommended: data.recommended,
    published: data.published,
    coverFileName: data.coverFileName,
    pdfFileName: data.pdfFileName,
  };
}

function buildTree(
  documents: Array<{ id: string; data: CategoryDocument }>,
  books: Book[] = []
): BookFolder {
  const folders = new Map(
    documents.map((document) => [document.id, toFolder(document.id, document.data)])
  );
  let root = folders.get("root");

  if (!root) {
    root = {
      id: "root",
      name: "Home",
      type: "folder",
      status: "Published",
      visibility: "published",
      sortOrder: 0,
      updatedAt: "Not available",
      children: [],
      books: [],
    };
  }

  for (const document of documents) {
    const folder = folders.get(document.id);
    const parentId = document.data.parentId;
    if (!folder || document.id === root.id) continue;

    const parent = parentId ? folders.get(parentId) : root;
    (parent?.children ?? root.children ?? []).push(folder);
  }

  const sortChildren = (folder: BookFolder) => {
    folder.children?.sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.name.localeCompare(right.name);
    });
    folder.children?.forEach(sortChildren);
  };

  sortChildren(root);

  for (const book of books) {
    const category = findFolder(root, book.categoryId ?? "");
    category?.books?.push(book);
  }

  return root;
}

function findFolder(folder: BookFolder, id: string): BookFolder | null {
  if (folder.id === id) return folder;
  for (const child of folder.children ?? []) {
    const result = findFolder(child, id);
    if (result) return result;
  }
  return null;
}

function findFolderPath(
  folder: BookFolder,
  id: string,
  path: string[] = []
): string[] | null {
  const nextPath = [...path, folder.name];
  if (folder.id === id) return nextPath;

  for (const child of folder.children ?? []) {
    const result = findFolderPath(child, id, nextPath);
    if (result) return result;
  }

  return null;
}

async function loadCatalogue(): Promise<BookFolder> {
  const [categorySnapshot, bookSnapshot] = await Promise.all([
    getDocs(collection(db, "categories")),
    getDocs(collection(db, "books")),
  ]);
  const books = bookSnapshot.docs.map((book) =>
    toBook(book.id, book.data() as BookDocument)
  );

  return buildTree(
    categorySnapshot.docs.map((category) => ({
      id: category.id,
      data: category.data() as CategoryDocument,
    })),
    books
  );
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<BookFolder>(() => buildTree([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setRoot(await loadCatalogue());
    } catch (loadError) {
      console.error("Failed to load categories", loadError);
      setError("Unable to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addFolder = async (parentId: string, folder: BookFolder) => {
    const duplicateSnapshot = await getDocs(
      query(
        collection(db, "categories"),
        where("parentId", "==", parentId === "root" ? null : parentId)
      )
    );
    const duplicate = duplicateSnapshot.docs.some(
      (category) =>
        String(category.data().name ?? "").trim().toLowerCase() ===
        folder.name.trim().toLowerCase()
    );

    if (duplicate) throw new Error("A category with this name already exists here.");

    const parentPath =
      findFolderPath(root, parentId)?.join("/") ?? "Home";
    await addDoc(collection(db, "categories"), {
      name: folder.name.trim(),
      parentId: parentId === "root" ? null : parentId,
      path: `${parentPath}/${folder.name.trim()}`,
      type: "folder",
      visibility: folder.visibility ?? "published",
      sortOrder: folder.sortOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await refresh();
  };

  const updateFolder = async (folderId: string, changes: Partial<BookFolder>) => {
    if (folderId === "root") return;
    const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (changes.name !== undefined) update.name = changes.name.trim();
    if (changes.sortOrder !== undefined) update.sortOrder = changes.sortOrder;
    if (changes.visibility !== undefined) update.visibility = changes.visibility;
    if (changes.status !== undefined && changes.visibility === undefined) {
      update.visibility = changes.status === "Published" ? "published" : "draft";
    }
    await updateDoc(doc(db, "categories", folderId), update);
    await refresh();
  };

  const deleteFolder = async (folderId: string) => {
    if (folderId === "root") return;
    const folder = findFolder(root, folderId);
    const descendants: string[] = [];
    const collectDescendants = (current: BookFolder) => {
      current.children?.forEach((child) => {
        descendants.push(child.id);
        collectDescendants(child);
      });
    };
    if (folder) collectDescendants(folder);
    await Promise.all(
      [folderId, ...descendants].map((id) => deleteDoc(doc(db, "categories", id)))
    );
    await refresh();
  };

  const addBook = async (book: NewBookData) => {
    const categoryPath = findFolderPath(root, book.categoryId)?.join("/");

    if (!categoryPath) {
      throw new Error("Select a valid category before saving the book.");
    }

    const bookReference = await addDoc(collection(db, "books"), {
      ...book,
      title: book.title.trim(),
      author: book.author.trim(),
      description: book.description.trim(),
      categoryId: book.categoryId,
      categoryPath,
      status: book.published ? "Published" : "Unpublished",
      purchases: 0,
      code: book.isbn.trim(),
      image: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(bookReference, { id: bookReference.id });

    await refresh();
  };

  return (
    <BooksContext.Provider value={{ root, addFolder, updateFolder, deleteFolder, refresh, isLoading, error, addBook }}>
      {children}
    </BooksContext.Provider>
  );
}
