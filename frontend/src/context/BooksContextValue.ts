import { createContext, useContext } from "react";

import type { BookFolder } from "../pages/Books/booksData";

export type BooksContextType = {
  root: BookFolder;
  addFolder: (parentId: string, folder: BookFolder) => void;
  updateFolder: (folderId: string, changes: Partial<BookFolder>) => void;
  deleteFolder: (folderId: string) => void;
};

export const BooksContext = createContext<BooksContextType | null>(null);

export function useBooksContext() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooksContext must be used inside BooksProvider");
  }
  return context;
}
