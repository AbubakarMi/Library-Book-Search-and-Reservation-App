import type { Book, User, Reservation } from "./types";

export const bookCategories = [
    "Fiction", "Science Fiction", "Mystery", "Fantasy", "Biography", 
    "History", "Science", "Technology", "Philosophy", "Self-Help"
];

export const books: Book[] = [
  { id: 'book-1', title: 'The Digital Fortress', author: 'Dan Brown', category: 'Mystery', language: 'English', publicationYear: 1998, availabilityStatus: 'available', coverImageId: 'book-cover-1' },
  { id: 'book-2', title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', language: 'English', publicationYear: 1965, availabilityStatus: 'reserved', coverImageId: 'book-cover-2' },
  { id: 'book-3', title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Mystery', language: 'English', publicationYear: 2019, availabilityStatus: 'checked_out', coverImageId: 'book-cover-3' },
  { id: 'book-4', title: 'Project Hail Mary', author: 'Andy Weir', category: 'Science Fiction', language: 'English', publicationYear: 2021, availabilityStatus: 'available', coverImageId: 'book-cover-4' },
  { id: 'book-5', title: 'A Game of Thrones', author: 'George R.R. Martin', category: 'Fantasy', language: 'English', publicationYear: 1996, availabilityStatus: 'reserved', coverImageId: 'book-cover-5' },
  { id: 'book-6', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', category: 'History', language: 'English', publicationYear: 2011, availabilityStatus: 'available', coverImageId: 'book-cover-6' },
  { id: 'book-7', title: 'The Lean Startup', author: 'Eric Ries', category: 'Technology', language: 'English', publicationYear: 2011, availabilityStatus: 'checked_out', coverImageId: 'book-cover-7' },
  { id: 'book-8', title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', language: 'English', publicationYear: 2011, availabilityStatus: 'available', coverImageId: 'book-cover-8' },
  { id: 'book-9', title: 'Meditations', author: 'Marcus Aurelius', category: 'Philosophy', language: 'English', publicationYear: 180, availabilityStatus: 'available', coverImageId: 'book-cover-9' },
  { id: 'book-10', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', language: 'English', publicationYear: 2018, availabilityStatus: 'reserved', coverImageId: 'book-cover-10' },
  { id: 'book-11', title: 'The Name of the Wind', author: 'Patrick Rothfuss', category: 'Fantasy', language: 'English', publicationYear: 2007, availabilityStatus: 'available', coverImageId: 'book-cover-11' },
  { id: 'book-12', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', language: 'English', publicationYear: 2008, availabilityStatus: 'available', coverImageId: 'book-cover-12' }
];

export const users: User[] = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
    { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', role: 'user', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
    { id: 'user-admin', name: 'Admin User', email: 'admin@libroreserva.com', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=user-admin' }
];

export const reservations: Reservation[] = [
    { id: 'res-1', userID: 'user-1', bookID: 'book-2', reservationDate: '2024-05-10', status: 'pending' },
    { id: 'res-2', userID: 'user-1', bookID: 'book-5', reservationDate: '2024-05-12', status: 'ready' },
    { id: 'res-3', userID: 'user-1', bookID: 'book-7', reservationDate: '2024-04-20', status: 'completed' },
    { id: 'res-4', userID: 'user-2', bookID: 'book-10', reservationDate: '2024-05-15', status: 'pending' },
    { id: 'res-5', userID: 'user-2', bookID: 'book-3', reservationDate: '2024-03-01', status: 'cancelled' }
];
