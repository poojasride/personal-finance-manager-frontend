# Password Reset Flow – Frontend (React)

This is the frontend implementation of the password reset flow built using React, React Router, Formik, Yup, and Axios.

## Features

- Forgot Password form
- Send reset email request
- Verify reset token
- Create new password
- Form validation using Yup
- API integration using Axios
- Navigation using React Router

## Tech Stack

- React
- React Router DOM
- Axios
- Formik
- Yup
- Tailwind CSS

## Pages Included

### 1. Forgot Password Page

User enters email and submits request.

Endpoint used:
POST /api/auth/forgot-password

---

### 2. Check Email Page

Displays message after email is sent.

Route:
/check-email

---

### 3. Verify Reset Token Page

Verifies token from URL.

Route:

/verify-reset-token/:token

Endpoint used:

GET /api/auth/verify-reset-token/:token

---

### 4. Create New Password Page

User enters new password and confirms reset.

Endpoint used:

POST /api/auth/reset-password/:token

---

## Installation

Install dependencies:

npm install

Start frontend:

npm run dev

Runs on:

http://localhost:5173

---

## Environment

Make sure backend runs on:

http://localhost:3000

---

## Flow Summary

1. User enters email
2. Email sent with reset link
3. User clicks link
4. Token verified
5. User creates new password
6. Password updated successfully

---
