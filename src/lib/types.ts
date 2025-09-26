export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  language: string;
  publicationYear: number;
  availabilityStatus: "available" | "reserved" | "checked_out";
  coverImageId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
};

export type Reservation = {
  id: string;
  userID: string;
  bookID: string;
  reservationDate: string;
  status: "pending" | "ready" | "completed" | "cancelled";
};

export type BorrowingRecord = {
  id: string;
  userID: string;
  bookID: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "active" | "returned" | "overdue" | "return_requested";
  fineAmount?: number;
  returnCondition?: "excellent" | "good" | "fair" | "damaged";
  librarianNotes?: string;
  returnNotes?: string;
};
