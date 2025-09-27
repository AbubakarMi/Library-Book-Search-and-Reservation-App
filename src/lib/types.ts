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
  role: "admin" | "staff" | "student";
  avatarUrl?: string;
  isActive?: boolean;
  suspendedAt?: string;
  suspendedBy?: string;
  suspensionReason?: string;
  createdBy?: string;
  password?: string;
  // Student-specific fields
  registrationNumber?: string;
  department?: string;
  profilePicture?: string;
};

export type Reservation = {
  id: string;
  userID: string;
  bookID: string;
  reservationDate: string;
  status: "pending" | "approved" | "rejected" | "ready" | "completed" | "cancelled";
  adminID?: string;
  approvalDate?: string;
  rejectionReason?: string;
  pickupDate?: string;
  expiryDate?: string;
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
