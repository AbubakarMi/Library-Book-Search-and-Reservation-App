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
