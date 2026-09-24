import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
  where,
  type Firestore,
} from "firebase/firestore";

export type CategoryContentType = "empty" | "categories" | "books";

export type CategoryRecord = {
  id: string;
  name: string;
  normalizedName: string;
  parentId: string | null;
  depth: number;
  contentType: CategoryContentType;
  subCategoryCount: number;
  bookCount: number;
  ancestorIds: string[];
  ancestorNames: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function normalizeCategoryName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function getCategories(db: Firestore) {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((item) => {
    const data = item.data();
    const name = String(data.name ?? "").trim().replace(/\s+/g, " ");
    const bookCount = Number(data.bookCount ?? 0);
    const subCategoryCount = Number(data.subCategoryCount ?? 0);
    return {
      ...data,
      id: item.id,
      name,
      normalizedName: String(data.normalizedName ?? normalizeCategoryName(name)),
      parentId: (data.parentId as string | null | undefined) ?? null,
      depth: Number(data.depth ?? 1),
      contentType: data.contentType ?? (subCategoryCount > 0 ? "categories" : bookCount > 0 ? "books" : "empty"),
      subCategoryCount,
      bookCount,
      ancestorIds: (data.ancestorIds as string[] | undefined) ?? [],
      ancestorNames: (data.ancestorNames as string[] | undefined) ?? [],
    } as CategoryRecord;
  });
}

export async function createCategory(
  db: Firestore,
  requestedParentId: string | null,
  rawName: string
) {
  const name = rawName.trim().replace(/\s+/g, " ");
  const normalizedName = normalizeCategoryName(name);
  if (!normalizedName) throw new Error("Category name is required.");

  const parentId = requestedParentId === "root" ? "root" : requestedParentId;
  const siblingSnapshot = await getDocs(
    query(collection(db, "categories"), where("parentId", "==", parentId))
  );
  if (siblingSnapshot.docs.some((item) => item.data().normalizedName === normalizedName)) {
    throw new Error("A category with this name already exists here.");
  }

  return runTransaction(db, async (transaction) => {
    const parentReference = parentId ? doc(db, "categories", parentId) : null;
    const parentSnapshot = parentReference
      ? await transaction.get(parentReference)
      : null;
    let parent = parentSnapshot?.exists()
      ? (parentSnapshot.data() as CategoryRecord)
      : null;
    let createdRoot = false;
    if (parentId === "root" && !parent) {
      createdRoot = true;
      parent = {
        id: "root",
        name: "Home",
        normalizedName: "home",
        parentId: null,
        depth: 1,
        contentType: "empty",
        subCategoryCount: 0,
        bookCount: 0,
        ancestorIds: [],
        ancestorNames: [],
      };
      transaction.set(parentReference!, {
        name: parent.name,
        normalizedName: parent.normalizedName,
        parentId: null,
        depth: 1,
        contentType: "categories",
        subCategoryCount: 1,
        bookCount: 0,
        ancestorIds: [],
        ancestorNames: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    const depth = parent ? parent.depth + 1 : 1;

    if (depth > 5) throw new Error("Maximum category depth is 5.");
    if (parent?.contentType === "books") {
      throw new Error("This category already contains books.");
    }

    const categoryReference = doc(collection(db, "categories"));
    const ancestorIds = parent
      ? [...(parent.ancestorIds ?? []), parent.id]
      : [];
    const ancestorNames = parent
      ? [...(parent.ancestorNames ?? []), parent.name]
      : [];

    transaction.set(categoryReference, {
      name,
      normalizedName,
      parentId,
      depth,
      contentType: "empty",
      subCategoryCount: 0,
      bookCount: 0,
      ancestorIds,
      ancestorNames,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (parentReference && !createdRoot) {
      transaction.update(parentReference, {
        subCategoryCount: increment(1),
        contentType: "categories",
        updatedAt: serverTimestamp(),
      });
    }

    return categoryReference.id;
  });
}

export async function deleteEmptyCategory(db: Firestore, categoryId: string) {
  if (categoryId === "root") return;

  return runTransaction(db, async (transaction) => {
    const categoryReference = doc(db, "categories", categoryId);
    const snapshot = await transaction.get(categoryReference);
    if (!snapshot.exists()) throw new Error("Category no longer exists.");

    const category = snapshot.data() as CategoryRecord;
    if (category.subCategoryCount > 0) {
      throw new Error("This category already contains sub-categories.");
    }
    if (category.bookCount > 0) {
      throw new Error("This category already contains books.");
    }

    if (category.parentId) {
      const parentReference = doc(db, "categories", category.parentId);
      const parentSnapshot = await transaction.get(parentReference);
      if (parentSnapshot.exists()) {
        const parent = parentSnapshot.data() as CategoryRecord;
        transaction.update(parentReference, {
          subCategoryCount: Math.max(0, (parent.subCategoryCount ?? 1) - 1),
          contentType: parent.bookCount > 0 ? "books" : "empty",
          updatedAt: serverTimestamp(),
        });
      }
    }

    transaction.delete(categoryReference);
  });
}

export async function renameCategory(
  db: Firestore,
  categoryId: string,
  rawName: string
) {
  const name = rawName.trim().replace(/\s+/g, " ");
  const normalizedName = normalizeCategoryName(name);
  if (!normalizedName) throw new Error("Category name is required.");

  const categories = await getCategories(db);
  const category = categories.find((item) => item.id === categoryId);
  if (!category) throw new Error("Category no longer exists.");

  if (categories.some((item) =>
    item.id !== categoryId &&
    item.parentId === category.parentId &&
    item.normalizedName === normalizedName
  )) {
    throw new Error("A category with this name already exists here.");
  }

  const descendants = categories.filter((item) =>
    item.ancestorIds?.includes(categoryId)
  );
  const booksSnapshot = await getDocs(collection(db, "books"));
  const batch = writeBatch(db);
  batch.update(doc(db, "categories", categoryId), {
    name,
    normalizedName,
    updatedAt: serverTimestamp(),
  });

  descendants.forEach((descendant) => {
    const index = descendant.ancestorIds.indexOf(categoryId);
    const ancestorNames = [...descendant.ancestorNames];
    if (index >= 0) ancestorNames[index] = name;
    batch.update(doc(db, "categories", descendant.id), {
      ancestorNames,
      updatedAt: serverTimestamp(),
    });
  });

  booksSnapshot.docs.forEach((book) => {
    const data = book.data();
    const pathIds = (data.categoryPathIds ?? []) as string[];
    const index = pathIds.indexOf(categoryId);
    if (index < 0) return;
    const pathNames = [...((data.categoryPathNames ?? []) as string[])];
    pathNames[index] = name;
    batch.update(book.ref, {
      categoryPathNames: pathNames,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
