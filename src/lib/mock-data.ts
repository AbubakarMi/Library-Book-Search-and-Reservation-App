import type { Book, User, Reservation, BorrowingRecord } from "./types";

export const bookCategories = [
    "Fiction", "Science Fiction", "Mystery", "Fantasy", "Biography", 
    "History", "Science", "Technology", "Philosophy", "Self-Help"
];

export const books: Book[] = [
  { id: 'book-1', title: 'The Digital Fortress', author: 'Dan Brown', category: 'Mystery', language: 'English', publicationYear: 1998, availabilityStatus: 'available', coverImageId: 'book-cover-1' },
  { id: 'book-2', title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', language: 'English', publicationYear: 1965, availabilityStatus: 'available', coverImageId: 'book-cover-2' },
  { id: 'book-3', title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Mystery', language: 'English', publicationYear: 2019, availabilityStatus: 'available', coverImageId: 'book-cover-3' },
  { id: 'book-4', title: 'Project Hail Mary', author: 'Andy Weir', category: 'Science Fiction', language: 'English', publicationYear: 2021, availabilityStatus: 'available', coverImageId: 'book-cover-4' },
  { id: 'book-5', title: 'A Game of Thrones', author: 'George R.R. Martin', category: 'Fantasy', language: 'English', publicationYear: 1996, availabilityStatus: 'available', coverImageId: 'book-cover-5' },
  { id: 'book-6', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', category: 'History', language: 'English', publicationYear: 2011, availabilityStatus: 'available', coverImageId: 'book-cover-6' },
  { id: 'book-7', title: 'The Lean Startup', author: 'Eric Ries', category: 'Technology', language: 'English', publicationYear: 2011, availabilityStatus: 'available', coverImageId: 'book-cover-7' },
  { id: 'book-8', title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', language: 'English', publicationYear: 2011, availabilityStatus: 'available', coverImageId: 'book-cover-8' },
  { id: 'book-9', title: 'Meditations', author: 'Marcus Aurelius', category: 'Philosophy', language: 'English', publicationYear: 180, availabilityStatus: 'available', coverImageId: 'book-cover-9' },
  { id: 'book-10', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', language: 'English', publicationYear: 2018, availabilityStatus: 'available', coverImageId: 'book-cover-10' },
  { id: 'book-11', title: 'The Name of the Wind', author: 'Patrick Rothfuss', category: 'Fantasy', language: 'English', publicationYear: 2007, availabilityStatus: 'available', coverImageId: 'book-cover-11' },
  { id: 'book-12', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', language: 'English', publicationYear: 2008, availabilityStatus: 'available', coverImageId: 'book-cover-12' }
];

export const users: User[] = [
    // Only admin user remains - students will register themselves
    { id: 'user-admin', name: 'Admin User', email: 'admin@libroreserva.com', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=user-admin' }
];

export const reservations: Reservation[] = [
    // Reservations will be created when students register and reserve books
];

export const borrowingRecords: BorrowingRecord[] = [
    // Borrowing records will be created when students borrow books
];
