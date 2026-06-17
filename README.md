# SCHEDIFY PLANNER

## Software Documentation

### Version

1.0

### Project Type

Web-Based Event Planning and Scheduling System

---

# 1. Introduction

## 1.1 Project Overview

Schedify Planner is a web-based scheduling and event management application designed to help users organize, track, and manage personal events through a modern and intuitive interface.

The system provides users with tools to create events, manage schedules, visualize upcoming activities, upload event images, and monitor weather forecasts for planned events.

Built using React, TypeScript, and Supabase, Schedify Planner offers a responsive and scalable solution for personal productivity and event organization.

---

# 2. Project Objectives

The system aims to:

* Simplify event planning and scheduling
* Improve personal time management
* Centralize event information
* Provide weather insights for scheduled events
* Enable secure cloud-based event storage
* Offer an intuitive and responsive user experience

---

# 3. System Architecture

Schedify Planner follows a client-cloud architecture.

## Presentation Layer

Frontend Technologies:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* HeroUI
* Material UI

Responsibilities:

* User Interface Rendering
* Form Validation
* Event Creation
* Calendar Display
* User Interaction

---

## Data Layer

Backend Service:

* Supabase

Responsibilities:

* Event Storage
* User Data Storage
* Authentication
* Media Storage
* Data Retrieval

---

## External Services

### Weather Forecast API

Used to:

* Retrieve weather forecasts
* Display event-day weather information
* Assist users in planning outdoor activities

---

# 4. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* HeroUI
* Material UI
* React Router

## Backend Services

* Supabase

## Development Tools

* ESLint
* Git
* GitHub

---

# 5. Functional Requirements

## FR-1 User Account Management

The system shall allow users to:

* Register an account
* Log in securely
* Manage profile information
* Configure account settings

---

## FR-2 Event Creation

The system shall allow users to:

* Create new events
* Specify event title
* Specify event date
* Specify event time
* Add event descriptions
* Upload event images

---

## FR-3 Event Editing

The system shall allow users to:

* Modify existing events
* Update event details
* Change event images
* Save updated information

---

## FR-4 Event Deletion

The system shall allow users to:

* Remove events
* Delete associated images
* Update event lists automatically

---

## FR-5 Calendar Management

The system shall:

* Display scheduled events
* Organize events by date
* Provide calendar-based navigation
* Support event tracking

---

## FR-6 Upcoming Events Dashboard

The system shall:

* Display upcoming activities
* Highlight future schedules
* Provide quick access to event information

---

## FR-7 Weather Forecasting

The system shall:

* Retrieve forecast data
* Display weather conditions
* Show temperature ranges
* Assist in planning outdoor events

---

# 6. Non-Functional Requirements

## Performance

* Event retrieval should occur within acceptable response times.
* Calendar updates should be rendered dynamically.

## Reliability

* Events must remain synchronized with the cloud database.
* Data integrity must be maintained.

## Usability

* User interfaces should remain intuitive.
* Navigation should require minimal learning.

## Scalability

* Database design should support growing event records.

## Maintainability

* Modular React component structure.
* Reusable TypeScript interfaces.

---

# 7. System Modules

## 7.1 Home Module

Purpose:

Provide a centralized dashboard.

Features:

* Upcoming Events
* Planned Events
* Quick Actions

Files:

```text
src/views/Home.tsx
src/components/Home/
```

---

## 7.2 Calendar Module

Purpose:

Visual representation of schedules.

Features:

* Calendar Navigation
* Event Tracking
* Date Management

Files:

```text
src/views/Calendar.tsx
src/components/Calendar/
```

---

## 7.3 Event Management Module

Purpose:

Create and manage event records.

Features:

* Create Event
* Edit Event
* Delete Event
* Upload Images

Files:

```text
src/views/Create.tsx
src/scripts/eventStore.ts
```

---

## 7.4 User Management Module

Purpose:

Handle user information.

Features:

* Account Management
* Profile Settings
* User Preferences

Files:

```text
src/views/Profile.tsx
src/views/Setup.tsx
src/scripts/userStore.ts
```

---

# 8. Database Design

## Events Table

| Field             | Type      | Description     |
| ----------------- | --------- | --------------- |
| id                | UUID      | Primary Key     |
| created_at        | Timestamp | Creation Date   |
| event_name        | String    | Event Title     |
| event_date        | Date      | Scheduled Date  |
| event_time        | Time      | Scheduled Time  |
| event_description | Text      | Event Details   |
| event_picture     | String    | Image URL       |
| user_id           | UUID      | Owner Reference |

---

# 9. Data Flow

## Event Creation Workflow

1. User opens Create Event page.
2. User enters event information.
3. User uploads an image.
4. Form validation is performed.
5. Data is sent to Supabase.
6. Event record is created.
7. Dashboard updates automatically.

---

## Event Retrieval Workflow

1. User accesses Home page.
2. Application requests event data.
3. Supabase returns records.
4. Events are sorted by date and time.
5. Upcoming events are displayed.

---

# 10. API and Service Integration

## Supabase

Functions:

* Create Events
* Read Events
* Update Events
* Delete Events
* Store Event Images

Connection File:

```text
src/lib/supabase.ts
```

---

## Weather Service

Functions:

* Retrieve weather forecasts
* Display daily weather conditions
* Show temperature information

Used within:

```text
src/views/Create.tsx
```

---

# 11. Security Considerations

Implemented:

* Environment Variables
* Supabase Authentication
* Client-Side Validation

Recommended Future Enhancements:

* Row-Level Security Policies
* Rate Limiting
* Session Expiration Controls
* Audit Logging

---

# 12. Project Structure

```text
schedify-planner/
│
├── public/
├── src/
│   ├── components/
│   ├── views/
│   ├── scripts/
│   ├── assets/
│   └── lib/
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

# 13. Future Enhancements

* Push Notifications
* Email Reminders
* Recurring Events
* Team Collaboration Features
* Mobile Application Version
* AI-Based Schedule Recommendations
* Google Calendar Integration
* Outlook Calendar Synchronization

---

# 14. Conclusion

Schedify Planner is a modern event scheduling and productivity platform that enables users to manage personal events efficiently through cloud-based storage, calendar visualization, weather forecasting, and event management tools. The system demonstrates the practical application of React, TypeScript, Supabase, and modern frontend development practices in creating a scalable productivity solution.
