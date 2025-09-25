# **App Name**: LibroReserva

## Core Features:

- Authentication: Implement Firebase Authentication with email/password and Google sign-in for role-based access (User/Admin).
- Book Search: Allow users to search for books by title, author, category, etc., with real-time availability status.
- Book Reservation: Enable users to reserve available books. Implement a reservation queuing system using Cloud Functions for high-demand books.
- User Dashboard: Display current reservations, reservation history, and book availability alerts for each user.
- Admin Dashboard: Provide an admin interface for adding/updating/removing books and managing users.
- Notifications: Send notifications via Firebase Cloud Messaging (FCM) when a reserved book is ready.
- Report Generation: Allow the admin to generate reports on book demand and usage. A generative AI tool can assist in summarizing and extracting key insights from the usage reports.

## Style Guidelines:

- Primary: Blue (#1E88E5) for headers, navbar, and main CTAs to build trust and focus.
- Secondary: Green (#00C897) for success states (book reserved, available) to encourage positivity.
- Warning: Amber (#FFC107) for reservation limits and pending queues to grab attention without alarming.
- Error: Red (#E63946) for unavailable books and failed reservations to trigger caution.
- Background: Light Gray (#F8F9FA) to keep the UI clean and readable.
- Body and headline font: 'PT Sans' for a modern look combined with warmth and personality.
- Use clear and recognizable icons for book categories, reservation statuses, and user actions.
- Implement a clean and intuitive layout with a focus on usability and accessibility.
- Use subtle animations and transitions to enhance user experience and provide feedback.