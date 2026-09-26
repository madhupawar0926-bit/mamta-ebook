import { collection, getDocs, type Firestore } from "firebase/firestore";

export type DashboardPeriod = "Weekly" | "Monthly" | "Yearly";

export type DashboardChartPoint = {
  month: string;
  revenue: number;
  purchases: number;
};

export type DashboardBook = {
  title: string;
  author: string;
  purchases: number;
  revenue: number;
  cover: string;
};

export type DashboardSnapshot = {
  stats: {
    totalBooks: number;
    totalStudents: number;
    totalPurchases: number;
    totalRevenue: number;
    categoryCount: number;
  };
  chartData: Record<DashboardPeriod, DashboardChartPoint[]>;
  summaries: Record<DashboardPeriod, { revenue: number; purchases: number }>;
  topBooks: DashboardBook[];
};

function toDate(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date(0);
}

function isSuccessful(data: Record<string, unknown>) {
  return ["paid", "completed", "demo_completed", "success"].includes(
    String(data.paymentStatus ?? data.status ?? "").toLowerCase()
  );
}

function emptySnapshot(): DashboardSnapshot {
  return {
    stats: { totalBooks: 0, totalStudents: 0, totalPurchases: 0, totalRevenue: 0, categoryCount: 0 },
    chartData: { Weekly: [], Monthly: [], Yearly: [] },
    summaries: {
      Weekly: { revenue: 0, purchases: 0 },
      Monthly: { revenue: 0, purchases: 0 },
      Yearly: { revenue: 0, purchases: 0 },
    },
    topBooks: [],
  };
}

export async function getDashboardSnapshot(db: Firestore): Promise<DashboardSnapshot> {
  const [books, categories, users, purchases] = await Promise.all([
    getDocs(collection(db, "books")),
    getDocs(collection(db, "categories")),
    getDocs(collection(db, "users")),
    getDocs(collection(db, "purchases")),
  ]);
  const snapshot = emptySnapshot();
  const students = users.docs.filter((user) => user.data().role === "student");
  const successfulPurchases = purchases.docs.filter((purchase) => isSuccessful(purchase.data()));
  const bookMap = new Map(books.docs.map((book) => [book.id, book.data()]));
  const bookTotals = new Map<string, { purchases: number; revenue: number }>();

  snapshot.stats = {
    totalBooks: books.size,
    totalStudents: students.length,
    totalPurchases: successfulPurchases.length,
    totalRevenue: successfulPurchases.reduce((sum, purchase) => sum + Number(purchase.data().amountPaid ?? purchase.data().originalPrice ?? 0), 0),
    categoryCount: Math.max(0, categories.size - (categories.docs.some((category) => category.id === "root") ? 1 : 0)),
  };

  successfulPurchases.forEach((purchase) => {
    const data = purchase.data();
    const bookId = String(data.bookId ?? "");
    const total = bookTotals.get(bookId) ?? { purchases: 0, revenue: 0 };
    total.purchases += 1;
    total.revenue += Number(data.amountPaid ?? data.originalPrice ?? 0);
    bookTotals.set(bookId, total);

    const date = toDate(data.purchasedAt ?? data.createdAt);
    const month = date.toLocaleDateString("en-IN", { month: "short" });
    const year = date.getFullYear();
    const daily = date.toLocaleDateString("en-IN", { weekday: "short" });
    const amount = Number(data.amountPaid ?? data.originalPrice ?? 0) / 1000;
    const addPoint = (period: DashboardPeriod, label: string, revenue: number) => {
      const points = snapshot.chartData[period];
      const point = points.find((item) => item.month === label);
      if (point) {
        point.revenue += revenue;
        point.purchases += 1;
      } else {
        points.push({ month: label, revenue, purchases: 1 });
      }
      snapshot.summaries[period].revenue += revenue * 1000;
      snapshot.summaries[period].purchases += 1;
    };
    addPoint("Weekly", daily, amount);
    addPoint("Monthly", `${month} ${year}`, amount);
    addPoint("Yearly", String(year), amount);
  });

  snapshot.topBooks = [...bookTotals.entries()]
    .sort((left, right) => right[1].revenue - left[1].revenue)
    .slice(0, 5)
    .map(([bookId, totals]) => {
      const book = bookMap.get(bookId) ?? {};
      return {
        title: String(book.title ?? "Untitled book"),
        author: String(book.authorName ?? "Unknown author"),
        purchases: totals.purchases,
        revenue: totals.revenue,
        cover: String(book.coverImageUrl ?? ""),
      };
    });

  return snapshot;
}
