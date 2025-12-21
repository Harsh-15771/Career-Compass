# Career Compass

Career Compass is a **full‑stack web platform** built to explore real‑world authentication, user interaction, and scalable backend design. The project goes beyond basic CRUD functionality and focuses on **engineering decisions commonly seen in production systems**.

The application combines secure authentication, user‑generated content, and interaction features in a clean, maintainable architecture.

---

## Overview

Career Compass allows users to create and share career‑related content, interact with posts through applauds, and explore public user profiles. The project is designed to demonstrate practical backend thinking, API design, and secure identity handling.

---

## Technology Stack

### Frontend

* React (Vite)
* Context API for state management
* Axios for API communication
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* JWT‑based authentication

### External Services

* Email OTP delivery using Nodemailer
* Cloudinary for media storage
* Gemini AI (content assistance)

---

## Authentication & Authorization

The authentication system is designed to handle multiple identity providers while maintaining database integrity and security.

### Email and Password with OTP Verification

* Users sign up using email and password
* User data is first stored in a temporary **PendingUser** collection
* A time‑bound OTP is sent to the registered email
* The user record is created in the main `users` collection only after successful OTP verification
* This approach ensures that no unverified user data exists in the primary database

### Session Handling

* JWT is issued after successful authentication
* Protected routes are secured using middleware
* Authorization checks are enforced on the backend

---

## Blog Management

* Authenticated users can create, edit, and delete blogs
* Only the original author is allowed to modify or delete their content
* Ownership checks are enforced server‑side
* Blogs support rich text and media uploads

---

## Applaud System

The applaud feature is implemented with scalability and data integrity in mind.

### Design Approach

* Applauds are stored in a separate `Applaud` collection
* Each applaud links a single user to a single blog
* A compound unique index on `(user, blog)` prevents duplicate applauds

### Benefits

* Prevents repeated applauds by the same user
* Avoids unbounded array growth in blog documents
* Enables efficient aggregation and analytics

---

## Public User Profiles

Each user has a publicly accessible profile page.

### Profile Information

* User name and avatar
* Academic details (branch and year)
* Blogs authored by the user
* Total applauds received across all blogs

### Data Exposure Policy

* Email addresses and authentication details are never exposed
* Public and private user data are clearly separated

---

## Media Handling

* Images are uploaded and stored using Cloudinary
* Secure upload presets are used
* Optimized media delivery for frontend usage

---

## AI Integration

* Gemini AI is integrated to assist with content creation
* Designed as an optional productivity feature rather than a core dependency

---

## Key Design Considerations

* No unverified users stored in the main database
* OTPs and passwords are securely hashed
* Authentication logic is centralized and enforced server‑side
* Data models are designed with scalability in mind
* Clear separation of concerns across controllers, routes, and services

---

## Project Structure

```
client/
  ├─ components/
  ├─ pages/
  ├─ context/
  └─ services/

server/
  ├─ controllers/
  ├─ models/
  ├─ routes/
  ├─ middleware/
  └─ config/
```

---

## Testing

* Manual API testing using Postman
* Authentication, authorization, and edge cases verified
* Duplicate applauds and unauthorized actions handled gracefully

---

## Future Improvements

* Rate limiting for authentication and OTP requests
* Audit logging for critical actions
* Advanced analytics on user engagement
* AI‑driven career recommendations

---

## Author

Harsh Mishra

---

This project is intended to demonstrate **practical full‑stack engineering skills**, secure authentication design, and scalable backend architecture suitable for real‑world applications.
