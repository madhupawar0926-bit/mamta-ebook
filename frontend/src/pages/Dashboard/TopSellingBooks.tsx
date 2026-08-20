const books = [
  {
    title: "Discrete Mathematics",
    author: "S. Lipschutz",
    purchases: "120",
    revenue: "₹35,880",
    cover: "DM",
  },
  {
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    purchases: "98",
    revenue: "₹29,302",
    cover: "EM",
  },
  {
    title: "Physics for Class 11",
    author: "D.C. Pandey",
    purchases: "76",
    revenue: "₹22,724",
    cover: "PH",
  },
];

export function TopSellingBooks() {
  return (
    <section className="dashboard-panel books-panel">
      <div className="panel-header">
        <h2>Top Selling Books (This Month)</h2>
        <button className="view-all-button">View All</button>
      </div>

      <div className="books-table">
        <div className="book-table-head">
          <span>Book</span>
          <span>Purchases</span>
          <span>Revenue</span>
        </div>

        {books.map((book) => (
          <div className="book-row" key={book.title}>
            <div className="book-info">
              <div className={`book-cover ${book.cover.toLowerCase()}`}>
                {book.cover}
              </div>

              <div>
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </div>
            </div>

            <span className="book-number">{book.purchases}</span>
            <span className="book-revenue">{book.revenue}</span>
          </div>
        ))}
      </div>
    </section>
  );
}