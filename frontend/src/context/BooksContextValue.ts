import { createContext, useContext } from "react";

import type { BookFolder } from "../pages/Books/booksData";

export type NewBookData = {
  title: string;
  author: string;
  isbn: string;
  price: number;
  language: string;
  description: string;
  tags: string;
  allowPreview: boolean;
  previewPages: number;
  featured: boolean;
  published: boolean;
  recommended: boolean;
  coverFileName: string;
  pdfFileName: string;
  categoryId: string;
};

export type BooksContextType = {
  root: BookFolder;
  addFolder: (parentId: string, folder: BookFolder) => Promise<void>;
  updateFolder: (folderId: string, changes: Partial<BookFolder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  refresh: () => Promise<void>;
  isLoading: boolean;
  error: string;
  addBook: (book: NewBookData) => Promise<void>;
};

export const BooksContext = createContext<BooksContextType | null>(null);

export function useBooksContext() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooksContext must be used inside BooksProvider");
  }
  return context;
}
