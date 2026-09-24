import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  runTransaction,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";

import type { NewBookData } from "../context/BooksContextValue";
import type { CategoryRecord } from "./categoryRepository";

export type BookRecord = NewBookData & {
  id: string;
  categoryPathIds: string[];
  categoryPathNames: string[];
  authorName: string;
  isbnOrBookCode: string;
  pageCount: number;
  currency: "INR";
  publisherName: string;
  coverImageUrl: string;
  coverStoragePath: string;
  coverOriginalFileName: string;
  pdfFileUrl: string;
  pdfStoragePath: string;
  pdfOriginalFileName: string;
  pdfSizeBytes: number;
  isFeatured: boolean;
  status: "draft" | "published";
  totalPurchases: number;
  totalRevenue: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

function safeFileName(name: string) {
  return name.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function getBooks(db: Firestore) {
  const snapshot = await getDocs(collection(db, "books"));
  return snapshot.docs.map((item) => ({
    ...(item.data() as Omit<BookRecord, "id">),
    id: item.id,
  }));
}

export async function getBook(db: Firestore, bookId: string) {
  const snapshot = await getDoc(doc(db, "books", bookId));
  if (!snapshot.exists()) return null;
  return { ...(snapshot.data() as Omit<BookRecord, "id">), id: snapshot.id };
}

export async function deleteBook(db: Firestore, bookId: string) {
  await runTransaction(db, async (transaction) => {
    const bookReference = doc(db, "books", bookId);
    const bookSnapshot = await transaction.get(bookReference);
    if (!bookSnapshot.exists()) throw new Error("Book no longer exists.");

    const categoryId = String(bookSnapshot.data().categoryId ?? "");
    if (categoryId) {
      const categoryReference = doc(db, "categories", categoryId);
      const categorySnapshot = await transaction.get(categoryReference);
      if (categorySnapshot.exists()) {
        const category = categorySnapshot.data() as CategoryRecord;
        transaction.update(categoryReference, {
          bookCount: Math.max(0, (category.bookCount ?? 1) - 1),
          contentType: category.subCategoryCount > 0 ? "categories" : "empty",
          updatedAt: serverTimestamp(),
        });
      }
    }

    transaction.delete(bookReference);
  });
}

export async function createBook(
  db: Firestore,
  storage: FirebaseStorage,
  input: NewBookData,
  categories: CategoryRecord[]
) {
  const category = categories.find((item) => item.id === input.categoryId);
  if (!category) throw new Error("Select a valid category before saving the book.");
  if (category.subCategoryCount > 0) {
    throw new Error("This category already contains sub-categories. Books cannot be added here.");
  }
  if (!input.title.trim()) throw new Error("Book title is required.");
  if (!input.author.trim()) throw new Error("Author is required.");
  if (!input.language.trim()) throw new Error("Language is required.");
  if (input.price < 0) throw new Error("Price cannot be negative.");
  if (input.pageCount < 0) throw new Error("Page count cannot be negative.");
  if (input.allowPreview && input.previewPages > input.pageCount) {
    throw new Error("Preview pages cannot exceed the page count.");
  }

  const bookReference = doc(collection(db, "books"));
  const categoryPathIds = [...(category.ancestorIds ?? []), category.id];
  const categoryPathNames = [...(category.ancestorNames ?? []), category.name];
  const coverPath = input.coverFile
    ? `books/${bookReference.id}/cover/${safeFileName(input.coverFile.name)}`
    : "";
  const pdfPath = input.pdfFile
    ? `books/${bookReference.id}/pdf/${safeFileName(input.pdfFile.name)}`
    : "";

  let coverImageUrl = "";
  let pdfFileUrl = "";
  if (input.coverFile) {
    const coverReference = ref(storage, coverPath);
    await uploadBytes(coverReference, input.coverFile, { contentType: input.coverFile.type });
    coverImageUrl = await getDownloadURL(coverReference);
  }
  if (input.pdfFile) {
    const pdfReference = ref(storage, pdfPath);
    await uploadBytes(pdfReference, input.pdfFile, { contentType: input.pdfFile.type });
    pdfFileUrl = await getDownloadURL(pdfReference);
  }

  await runTransaction(db, async (transaction) => {
    const categoryReference = doc(db, "categories", category.id);
    const categorySnapshot = await transaction.get(categoryReference);
    if (!categorySnapshot.exists()) throw new Error("The selected category no longer exists.");
    const currentCategory = categorySnapshot.data() as CategoryRecord;
    if (currentCategory.subCategoryCount > 0) {
      throw new Error("This category already contains sub-categories. Books cannot be added here.");
    }

    transaction.set(bookReference, {
      categoryId: category.id,
      categoryPathIds,
      categoryPathNames,
      title: input.title.trim(),
      authorName: input.author.trim(),
      description: input.description.trim(),
      isbnOrBookCode: input.isbn.trim(),
      language: input.language.trim(),
      pageCount: input.pageCount,
      price: input.price,
      currency: "INR",
      publisherName: input.publisherName.trim() || "Mamta Publications",
      coverImageUrl,
      coverStoragePath: coverPath,
      coverOriginalFileName: input.coverFileName,
      pdfFileUrl,
      pdfStoragePath: pdfPath,
      pdfOriginalFileName: input.pdfFileName,
      pdfSizeBytes: input.pdfFile?.size ?? 0,
      isFeatured: input.featured,
      status: input.published ? "published" : "draft",
      allowPreview: input.allowPreview,
      previewPages: input.allowPreview ? input.previewPages : 0,
      totalPurchases: 0,
      totalRevenue: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.update(categoryReference, {
      bookCount: increment(1),
      contentType: "books",
      updatedAt: serverTimestamp(),
    });
  });
}
