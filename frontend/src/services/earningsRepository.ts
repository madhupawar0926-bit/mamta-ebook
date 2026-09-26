import { collection, getDocs, type Firestore } from "firebase/firestore";

export type EarningsPurchase = {
  id: string;
  orderId: string;
  student: string;
  book: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  date: Date;
};

function toDate(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(0);
}

function purchaseStatus(data: Record<string, unknown>): EarningsPurchase["status"] {
  const value = String(data.paymentStatus ?? data.status ?? "pending").toLowerCase();
  if (["paid", "completed", "demo_completed", "success"].includes(value)) return "Success";
  if (["failed", "refunded"].includes(value)) return "Failed";
  return "Pending";
}

export async function getEarningsPurchases(db: Firestore) {
  const [purchaseSnapshot, userSnapshot, bookSnapshot] = await Promise.all([
    getDocs(collection(db, "purchases")),
    getDocs(collection(db, "users")),
    getDocs(collection(db, "books")),
  ]);

  const users = new Map(
    userSnapshot.docs.map((user) => [user.id, String(user.data().name ?? user.data().phoneNumber ?? "Unknown student")])
  );
  const books = new Map(
    bookSnapshot.docs.map((book) => [book.id, String(book.data().title ?? "Unknown book")])
  );

  return purchaseSnapshot.docs.map((purchase) => {
    const data = purchase.data();
    return {
      id: purchase.id,
      orderId: String(data.orderId ?? data.orderID ?? purchase.id),
      student: String(data.studentName ?? users.get(String(data.studentUid ?? "")) ?? "Unknown student"),
      book: String(data.bookTitle ?? books.get(String(data.bookId ?? "")) ?? "Unknown book"),
      amount: Number(data.amountPaid ?? data.originalPrice ?? 0),
      status: purchaseStatus(data),
      date: toDate(data.purchasedAt ?? data.createdAt ?? data.updatedAt),
    } satisfies EarningsPurchase;
  }).sort((left, right) => right.date.getTime() - left.date.getTime());
}
