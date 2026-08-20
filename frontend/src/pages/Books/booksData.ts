export type Book = {
  id: string;
  title: string;
  code: string;
  author: string;
  price: number;
  purchases: number;
  status: "Published" | "Unpublished";
  updatedAt: string;
  image: string;
};

export type BookFolder = {
  id: string;
  name: string;
  type: "folder";
  status: "Published" | "Unpublished";
  sortOrder: number;
  updatedAt: string;

  /**
   * Unlimited nesting.
   * A folder can contain folders and/or books.
   */
  children?: BookFolder[];

  books?: Book[];
};


/*
|--------------------------------------------------------------------------
| SAMPLE BOOKS
|--------------------------------------------------------------------------
*/

export const books: Book[] = [
  {
    id: "BK-000123",
    title: "Physics for Class 11",
    code: "BK-000123",
    author: "D.C. Pandey",
    price: 299,
    purchases: 1245,
    status: "Published",
    updatedAt: "14 Aug 2026, 09:20 AM",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&q=80",
  },
  {
    id: "BK-000124",
    title: "Chemistry Part 1 for Class 11",
    code: "BK-000124",
    author: "P. Bahadur",
    price: 279,
    purchases: 987,
    status: "Published",
    updatedAt: "13 Aug 2026, 06:10 PM",
    image:
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=100&q=80",
  },
  {
    id: "BK-000125",
    title: "Mathematics for Class 11",
    code: "BK-000125",
    author: "R.D. Sharma",
    price: 320,
    purchases: 1532,
    status: "Unpublished",
    updatedAt: "11 Aug 2026, 03:40 PM",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&q=80",
  },
  {
    id: "BK-000126",
    title: "Biology for Class 11",
    code: "BK-000126",
    author: "Trueman",
    price: 350,
    purchases: 854,
    status: "Published",
    updatedAt: "10 Aug 2026, 11:30 AM",
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=100&q=80",
  },
];


/*
|--------------------------------------------------------------------------
| FOLDER TREE
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| children can contain another BookFolder.
|
| Therefore:
|
| Home
|   └── School Books
|       └── CBSE
|           └── Class 11
|               └── Science
|                   └── Physics
|                       └── Mechanics
|                           └── Chapter 1
|
| There is NO hard-coded depth.
|--------------------------------------------------------------------------
*/

export const rootFolder: BookFolder = {
  id: "root",
  name: "Home",
  type: "folder",
  status: "Published",
  sortOrder: 0,
  updatedAt: "14 Aug 2026, 10:30 AM",

  children: [
    {
      id: "school-books",
      name: "School Books",
      type: "folder",
      status: "Published",
      sortOrder: 1,
      updatedAt: "14 Aug 2026, 10:30 AM",

      children: [
        {
          id: "cbse",
          name: "CBSE",
          type: "folder",
          status: "Published",
          sortOrder: 1,
          updatedAt: "14 Aug 2026, 10:30 AM",

          children: [
            {
              id: "class-11",
              name: "Class 11",
              type: "folder",
              status: "Published",
              sortOrder: 1,
              updatedAt: "14 Aug 2026, 10:30 AM",

              children: [
                {
                  id: "science",
                  name: "Science",
                  type: "folder",
                  status: "Published",
                  sortOrder: 1,
                  updatedAt: "14 Aug 2026, 10:30 AM",

                  children: [
                    {
                      id: "physics",
                      name: "Physics",
                      type: "folder",
                      status: "Published",
                      sortOrder: 1,
                      updatedAt: "14 Aug 2026, 10:30 AM",

                      children: [
                        {
                          id: "mechanics",
                          name: "Mechanics",
                          type: "folder",
                          status: "Published",
                          sortOrder: 1,
                          updatedAt: "14 Aug 2026, 10:30 AM",

                          children: [
                            {
                              id: "motion",
                              name: "Motion",
                              type: "folder",
                              status: "Published",
                              sortOrder: 1,
                              updatedAt: "14 Aug 2026, 10:30 AM",

                              books: [
                                books[0],
                              ],
                            },
                          ],
                        },
                      ],

                      books: [
                        books[0],
                      ],
                    },

                    {
                      id: "chemistry",
                      name: "Chemistry",
                      type: "folder",
                      status: "Published",
                      sortOrder: 2,
                      updatedAt: "13 Aug 2026, 04:45 PM",

                      books: [
                        books[1],
                      ],
                    },

                    {
                      id: "mathematics",
                      name: "Mathematics",
                      type: "folder",
                      status: "Published",
                      sortOrder: 3,
                      updatedAt: "13 Aug 2026, 11:15 AM",

                      children: [
                        {
                          id: "algebra",
                          name: "Algebra",
                          type: "folder",
                          status: "Published",
                          sortOrder: 1,
                          updatedAt: "13 Aug 2026, 11:15 AM",

                          books: [
                            books[2],
                          ],
                        },
                      ],

                      books: [
                        books[2],
                      ],
                    },

                    {
                      id: "biology",
                      name: "Biology",
                      type: "folder",
                      status: "Published",
                      sortOrder: 4,
                      updatedAt: "12 Aug 2026, 02:20 PM",

                      books: [
                        books[3],
                      ],
                    },

                    {
                      id: "computer-science",
                      name: "Computer Science",
                      type: "folder",
                      status: "Published",
                      sortOrder: 5,
                      updatedAt: "12 Aug 2026, 09:05 AM",
                    },
                  ],
                },

                {
                  id: "commerce",
                  name: "Commerce",
                  type: "folder",
                  status: "Published",
                  sortOrder: 2,
                  updatedAt: "12 Aug 2026, 09:00 AM",
                },

                {
                  id: "arts",
                  name: "Arts",
                  type: "folder",
                  status: "Published",
                  sortOrder: 3,
                  updatedAt: "11 Aug 2026, 04:20 PM",
                },
              ],
            },

            {
              id: "class-12",
              name: "Class 12",
              type: "folder",
              status: "Published",
              sortOrder: 2,
              updatedAt: "10 Aug 2026, 05:00 PM",
            },
          ],
        },

        {
          id: "icse",
          name: "ICSE",
          type: "folder",
          status: "Published",
          sortOrder: 2,
          updatedAt: "09 Aug 2026, 03:00 PM",
        },

        {
          id: "competitive-exams",
          name: "Competitive Exams",
          type: "folder",
          status: "Published",
          sortOrder: 3,
          updatedAt: "08 Aug 2026, 01:30 PM",
        },

        {
          id: "graduation",
          name: "Graduation",
          type: "folder",
          status: "Published",
          sortOrder: 4,
          updatedAt: "07 Aug 2026, 12:00 PM",
        },

        {
          id: "post-graduation",
          name: "Post Graduation",
          type: "folder",
          status: "Published",
          sortOrder: 5,
          updatedAt: "06 Aug 2026, 10:00 AM",
        },

        {
          id: "reference-books",
          name: "Reference Books",
          type: "folder",
          status: "Published",
          sortOrder: 6,
          updatedAt: "05 Aug 2026, 09:00 AM",
        },

        {
          id: "kids",
          name: "Kids",
          type: "folder",
          status: "Published",
          sortOrder: 7,
          updatedAt: "04 Aug 2026, 09:00 AM",
        },
      ],
    },
  ],
};