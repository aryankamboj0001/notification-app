# Campus Notification System

## Overview

Campus Notification System is a React-based web application that fetches notifications from the AffordMed Evaluation Service API and displays them in a Priority Inbox.

The application authenticates users using a Bearer Token, retrieves notifications from the protected API, and displays the most important notifications based on priority and recency.

---

## Features

### Stage 1

* Authentication using Auth API
* Fetch notifications from protected API
* Priority Inbox implementation
* Top 10 notifications display
* Notification sorting based on:

  * Placement (Highest Priority)
  * Result
  * Event (Lowest Priority)
* Timestamp-based ordering for notifications of the same type

### Stage 2

* Responsive React UI
* Filter notifications by type

  * All
  * Placement
  * Result
  * Event
* Read / Unread notification tracking
* Pagination support
* Local Storage integration for viewed notifications

---

## Technology Stack

* React
* JavaScript
* Axios
* Vite

---

## Project Structure

```text
notification-app/
│
├── src/
│   ├── pages/
│   │   └── AllNotifications.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
│
├── Notification_System_Design.md
├── stage1-output.png
├── package.json
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/aryankamboj0001/notification-app.git
```

Move into project directory:

```bash
cd notification-app
```

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Priority Calculation

Priority values:

| Type      | Priority |
| --------- | -------- |
| Placement | 3        |
| Result    | 2        |
| Event     | 1        |

Notifications are sorted first by priority and then by timestamp.

---

## API Endpoints Used

### Authentication

```http
POST /evaluation-service/auth
```

### Notifications

```http
GET /evaluation-service/notifications
```

---

## Author

Aryan Kumar

Roll No: 2330700
