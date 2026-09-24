import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { db, storage } from "../firebase";
import {
  createCategory,
  deleteEmptyCategory,
  getCategories,
  renameCategory,
  type CategoryRecord,
} from "../services/categoryRepository";
import {
  createBook,
  deleteBook as deleteBookRecord,
  getBook as getBookRecord,
  getBooks,
  type BookRecord,
} from "../services/bookRepository";
import { type BookFolder } from "../pages/Books/booksData";
import { BooksContext, type NewBookData } from "./BooksContextValue";

function formatTimestamp(value: unknown): string {
  if (!value || typeof value !== "object" || !("toDate" in value)) return "Not available";
  const date = (value as { toDate: () => Date }).toDate();
  return `${date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
}

function findFolder(folder: BookFolder, id: string): BookFolder | null {
  if (folder.id === id) return folder;
  for (const child of folder.children ?? []) {
    const result = findFolder(child, id);
    if (result) return result;
  }
  return null;
}

function buildTree(categories: CategoryRecord[], books: BookRecord[]): BookFolder {
  const folders = new Map<string, BookFolder>();
  categories.forEach((category) => {
    folders.set(category.id, {
      id: category.id,
      name: category.name,
      type: "folder",
      status: "Published",
      contentType: category.contentType,
      sortOrder: category.depth,
      updatedAt: formatTimestamp(category.updatedAt),
      children: [],
      books: [],
    });
  });

  let root = folders.get("root");
  if (!root) {
    root = {
      id: "root",
      name: "Home",
      type: "folder",
      status: "Published",
      contentType: "empty",
      sortOrder: 1,
      updatedAt: "Not available",
      children: [],
      books: [],
    };
  }

  categories.forEach((category) => {
    const folder = folders.get(category.id);
    if (!folder || category.id === root.id) return;
    const parent = category.parentId ? folders.get(category.parentId) : root;
    parent?.children?.push(folder);
  });

  const sortChildren = (folder: BookFolder) => {
    folder.children?.sort((left, right) => left.name.localeCompare(right.name));
    folder.children?.forEach(sortChildren);
  };
  sortChildren(root);

  books.forEach((book) => {
    findFolder(root, book.categoryId)?.books?.push({
      id: book.id,
      title: book.title,
      code: book.isbnOrBookCode || book.id,
      author: book.authorName,
      price: book.price,
      purchases: book.totalPurchases,
      status: book.status === "published" ? "Published" : "Unpublished",
      updatedAt: formatTimestamp(book.updatedAt),
      image: book.coverImageUrl,
      categoryId: book.categoryId,
      categoryPath: book.categoryPathNames.join("/"),
      authorName: book.authorName,
      isbnOrBookCode: book.isbnOrBookCode,
      pageCount: book.pageCount,
      publisherName: book.publisherName,
      currency: book.currency,
      coverImageUrl: book.coverImageUrl,
      coverStoragePath: book.coverStoragePath,
      coverOriginalFileName: book.coverOriginalFileName,
      pdfFileUrl: book.pdfFileUrl,
      pdfStoragePath: book.pdfStoragePath,
      pdfOriginalFileName: book.pdfOriginalFileName,
      pdfSizeBytes: book.pdfSizeBytes,
      isFeatured: book.isFeatured,
      totalPurchases: book.totalPurchases,
      totalRevenue: book.totalRevenue,
      categoryPathIds: book.categoryPathIds,
      categoryPathNames: book.categoryPathNames,
    });
  });

  return root;
}

async function loadCatalogue() {
  const [categories, books] = await Promise.all([getCategories(db), getBooks(db)]);
  return buildTree(categories, books);
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<BookFolder>(() => buildTree([], []));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setRoot(await loadCatalogue());
    } catch (loadError) {
      console.error("Failed to load catalogue", loadError);
      setError("Unable to load categories and books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const categoryUnsubscribe = onSnapshot(collection(db, "categories"), () => void refresh());
    const bookUnsubscribe = onSnapshot(collection(db, "books"), () => void refresh());
    return () => {
      categoryUnsubscribe();
      bookUnsubscribe();
    };
  }, [refresh]);

  const addFolder = async (parentId: string, folder: BookFolder) => {
    await createCategory(db, parentId === "root" ? "root" : parentId, folder.name);
    await refresh();
  };

  const updateFolder = async (folderId: string, changes: Partial<BookFolder>) => {
    if (changes.name) {
      await renameCategory(db, folderId, changes.name);
    }
    await refresh();
  };

  const deleteFolder = async (folderId: string) => {
    await deleteEmptyCategory(db, folderId);
    await refresh();
  };

  const addBook = async (book: NewBookData) => {
    const categories = await getCategories(db);
    await createBook(db, storage, book, categories);
    await refresh();
  };

  const getBook = async (bookId: string): Promise<NewBookData | null> => {
    const book = await getBookRecord(db, bookId);
    if (!book) return null;
    return {
      title: book.title,
      author: book.authorName,
      isbn: book.isbnOrBookCode,
      price: book.price,
      language: book.language,
      description: book.description,
      tags: String(book.pageCount),
      pageCount: book.pageCount,
      publisherName: book.publisherName,
      allowPreview: book.allowPreview,
      previewPages: book.previewPages,
      featured: book.isFeatured,
      published: book.status === "published",
      recommended: false,
      coverFileName: book.coverOriginalFileName,
      pdfFileName: book.pdfOriginalFileName,
      coverImageUrl: book.coverImageUrl,
      pdfFileUrl: book.pdfFileUrl,
      categoryId: book.categoryId,
    };
  };

  const updateBook = async (bookId: string, book: NewBookData) => {
    await updateDoc(doc(db, "books", bookId), {
      title: book.title.trim(),
      authorName: book.author.trim(),
      isbnOrBookCode: book.isbn.trim(),
      price: book.price,
      language: book.language.trim(),
      description: book.description.trim(),
      pageCount: book.pageCount,
      publisherName: book.publisherName.trim() || "Mamta Publications",
      allowPreview: book.allowPreview,
      previewPages: book.allowPreview ? book.previewPages : 0,
      isFeatured: book.featured,
      status: book.published ? "published" : "draft",
      updatedAt: serverTimestamp(),
    });
    await refresh();
  };

  const deleteBook = async (bookId: string) => {
    await deleteBookRecord(db, bookId);
    await refresh();
  };

  return (
    <BooksContext.Provider value={{ root, addFolder, updateFolder, deleteFolder, refresh, isLoading, error, addBook, updateBook, deleteBook, getBook }}>
      {children}
    </BooksContext.Provider>
  );
}
