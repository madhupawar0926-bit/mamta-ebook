import { useState, type ReactNode } from "react";

import {
  rootFolder as initialRoot,
  type BookFolder,
} from "../pages/Books/booksData";
import { BooksContext } from "./BooksContextValue";

/* =========================================================
   HELPERS
   ========================================================= */

function insertFolder(
  tree: BookFolder,
  parentId: string,
  newFolder: BookFolder
): BookFolder {
  if (tree.id === parentId) {
    return {
      ...tree,
      children: [...(tree.children ?? []), newFolder],
    };
  }

  return {
    ...tree,
    children: tree.children?.map((child) =>
      insertFolder(child, parentId, newFolder)
    ),
  };
}

function updateFolder(
  tree: BookFolder,
  folderId: string,
  changes: Partial<BookFolder>
): BookFolder {
  if (tree.id === folderId) return { ...tree, ...changes };

  return {
    ...tree,
    children: tree.children?.map((child) =>
      updateFolder(child, folderId, changes)
    ),
  };
}

function removeFolder(tree: BookFolder, folderId: string): BookFolder {
  return {
    ...tree,
    children: tree.children
      ?.filter((child) => child.id !== folderId)
      .map((child) => removeFolder(child, folderId)),
  };
}

/* =========================================================
   CONTEXT
   ========================================================= */

export function BooksProvider({ children }: { children: ReactNode }) {
  const [root, setRoot] = useState<BookFolder>(initialRoot);

  const addFolder = (parentId: string, folder: BookFolder) => {
    setRoot((prev) => insertFolder(prev, parentId, folder));
  };

  const updateFolderById = (
    folderId: string,
    changes: Partial<BookFolder>
  ) => {
    setRoot((prev) => updateFolder(prev, folderId, changes));
  };

  const deleteFolder = (folderId: string) => {
    setRoot((prev) => removeFolder(prev, folderId));
  };

  return (
    <BooksContext.Provider
      value={{ root, addFolder, updateFolder: updateFolderById, deleteFolder }}
    >
      {children}
    </BooksContext.Provider>
  );
}
