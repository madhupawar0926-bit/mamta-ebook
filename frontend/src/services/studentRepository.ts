import {
  collection,
  getDocs,
  query,
  where,
  type Firestore,
} from "firebase/firestore";

export type StudentRecord = {
  id: string;
  initials: string;
  name: string;
  phone: string;
  email: string;
  books: number;
  spent: number;
  status: "Active" | "Flagged" | "Banned";
  registrationDate: string;
  lastActive: string;
  accountStatus: string;
  booksPurchased: string;
  totalSpent: string;
  securityMistakes: number;
};

export type PurchasedBookRecord = {
  id: string;
  title: string;
  date: string;
  price: string;
  image: string;
};

export type DeviceRecord = {
  id: string;
  name: string;
  model: string;
  details: string;
  lastActive: string;
  kind: "laptop" | "phone";
};

function formatDate(value: unknown, fallback = "Not available") {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return fallback;
  }

  const date = (value as { toDate: () => Date }).toDate();
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ST";
}

function statusFor(data: Record<string, unknown>): StudentRecord["status"] {
  if (data.accountStatus === "banned") return "Banned";
  if (Number(data.securityMistakes ?? 0) > 0) return "Flagged";
  return "Active";
}

export async function getStudents(db: Firestore): Promise<StudentRecord[]> {
  const [studentSnapshot, purchaseSnapshot] = await Promise.all([
    getDocs(query(collection(db, "users"), where("role", "==", "student"))),
    getDocs(collection(db, "purchases")),
  ]);

  const purchaseCounts = new Map<string, number>();
  const purchaseTotals = new Map<string, number>();

  purchaseSnapshot.docs.forEach((purchaseDoc) => {
    const data = purchaseDoc.data() as Record<string, unknown>;
    const studentId = String(data.studentUid ?? data.studentId ?? data.uid ?? "");

    if (!studentId) return;

    const amount = Number(data.amountPaid ?? data.originalPrice ?? 0);

    purchaseCounts.set(studentId, (purchaseCounts.get(studentId) ?? 0) + 1);
    purchaseTotals.set(studentId, (purchaseTotals.get(studentId) ?? 0) + amount);
  });

  return studentSnapshot.docs
    .map((student) => {
      const data = student.data();
      const name = String(data.name ?? "Unnamed student");
      const accountStatus = String(data.accountStatus ?? "active");
      const status = statusFor(data);
      const spent = purchaseTotals.get(student.id) ?? Number(data.totalSpent ?? 0);
      const books = purchaseCounts.get(student.id) ?? Number(data.booksPurchased ?? 0);

      return {
        id: student.id,
        initials: initials(name),
        name,
        phone: String(data.phoneNumber ?? "Not available"),
        email: String(data.email ?? "Not available"),
        books,
        spent,
        status,
        registrationDate: formatDate(data.createdAt),
        lastActive: formatDate(data.lastActiveAt, "Not available"),
        accountStatus: accountStatus === "banned" ? "Banned" : "Active",
        booksPurchased: `${books} Books`,
        totalSpent: `Rs.${spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        securityMistakes: Number(data.securityMistakes ?? 0),
      };
    })
    .sort((a, b) => {
      const aDate = a.registrationDate;
      const bDate = b.registrationDate;

      if (aDate === "Not available") return 1;
      if (bDate === "Not available") return -1;

      return bDate.localeCompare(aDate);
    });
}

export async function getStudentPurchases(
  db: Firestore,
  studentUid: string
): Promise<PurchasedBookRecord[]> {
  const [purchaseSnapshot, bookSnapshot] = await Promise.all([
    getDocs(query(collection(db, "purchases"), where("studentUid", "==", studentUid))),
    getDocs(collection(db, "books")),
  ]);

  const bookMap = new Map<string, { title: string; image: string }>();

  bookSnapshot.docs.forEach((bookDoc) => {
    const data = bookDoc.data() as Record<string, unknown>;
    const title = String(data.title ?? data.name ?? "Untitled book");
    const image = String(
      data.coverImageUrl ??
        data.cover ??
        data.image ??
        data.imageUrl ??
        data.coverUrl ??
        ""
    );

    bookMap.set(bookDoc.id, { title, image });
  });

  return purchaseSnapshot.docs.map((purchase) => {
    const data = purchase.data() as Record<string, unknown>;
    const bookId = String(data.bookId ?? "");
    const bookInfo = bookId ? bookMap.get(bookId) : undefined;
    const title = String(
      data.bookTitle ??
        data.title ??
        bookInfo?.title ??
        "Untitled book"
    );
    const image = String(
      data.coverImageUrl ??
        data.cover ??
        data.bookCoverImageUrl ??
        data.image ??
        data.imageUrl ??
        data.coverUrl ??
        data.bookImageUrl ??
        bookInfo?.image ??
        ""
    );

    return {
      id: purchase.id,
      title,
      date: `Purchased on ${formatDate(data.purchasedAt, "date unavailable")}`,
      price: `Rs.${Number(data.amountPaid ?? data.originalPrice ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      image,
    };
  });
}

export async function getStudentDevices(
  db: Firestore,
  studentUid: string
): Promise<DeviceRecord[]> {
  const snapshot = await getDocs(collection(db, "users", studentUid, "devices"));

  return snapshot.docs.slice(0, 2).map((device) => {
    const data = device.data();
    const platform = String(data.platform ?? data.deviceType ?? "Android");
    const model = String(
      data.deviceModel ?? data.model ?? data.deviceInfo ?? data.name ?? "Unknown model"
    );
    const kind = /windows|mac|linux|desktop|laptop/i.test(`${platform} ${model}`)
      ? "laptop"
      : "phone";
    const lastActiveValue = data.lastActiveAt ?? data.lastSeenAt ?? data.lastSeen ?? null;

    return {
      id: device.id,
      name: String(data.deviceName ?? data.deviceLabel ?? platform),
      model,
      details: `${platform} · ${String(data.browser ?? data.osVersion ?? "Device")}`,
      lastActive: lastActiveValue ? formatDate(lastActiveValue) : "Last active unavailable",
      kind,
    };
  });
}

export async function getPurchaseStats(db: Firestore) {
  const snapshot = await getDocs(collection(db, "purchases"));
  const buyerIds = new Set<string>();
  let revenue = 0;

  snapshot.docs.forEach((purchase) => {
    const data = purchase.data();
    if (["paid", "completed", "demo_completed"].includes(String(data.paymentStatus ?? data.status))) {
      const studentUid = String(data.studentUid ?? "");
      if (studentUid) buyerIds.add(studentUid);
      revenue += Number(data.amountPaid ?? data.originalPrice ?? 0);
    }
  });

  return { activeBuyers: buyerIds.size, revenue };
}
