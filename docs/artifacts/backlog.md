# Functional Product Backlog – Task Manager with Streaming Attachments

## Backlog Prioritization Method

The backlog is organized according to **MoSCoW prioritization**:

* **Must Have (M):** Essential for the Minimum Viable Product (MVP).
* **Should Have (S):** Important features that improve usability but are not critical for launch.
* **Could Have (C):** Enhancements that add value if time permits.
* **Won't Have (W):** Explicitly excluded from the current release.

---

# Epic 1 – User Authentication & Account Management

**Goal**

Allow users to securely register, authenticate, and manage their accounts.

## Feature 1.1 – User Registration

| ID      | Task                            | Priority |
| ------- | ------------------------------- | -------- |
| AUTH-01 | Create user registration API    | M        |
| AUTH-02 | Validate user input             | M        |
| AUTH-03 | Encrypt passwords               | M        |
| AUTH-04 | Store user profile              | M        |
| AUTH-05 | Verify duplicate email/username | M        |

---

## Feature 1.2 – Authentication

| ID      | Task                      | Priority |
| ------- | ------------------------- | -------- |
| AUTH-06 | Implement login endpoint  | M        |
| AUTH-07 | Generate JWT tokens       | M        |
| AUTH-08 | Validate JWT middleware   | M        |
| AUTH-09 | Implement logout          | S        |
| AUTH-10 | Token expiration handling | M        |

---

## Feature 1.3 – Account Management

| ID      | Task                | Priority |
| ------- | ------------------- | -------- |
| AUTH-11 | Update user profile | S        |
| AUTH-12 | Change password     | S        |
| AUTH-13 | Password recovery   | S        |

---

# Epic 2 – Task Management

**Goal**

Allow users to create and manage tasks throughout their lifecycle.

## Feature 2.1 – Task CRUD

| ID      | Task          | Priority |
| ------- | ------------- | -------- |
| TASK-01 | Create task   | M        |
| TASK-02 | Retrieve task | M        |
| TASK-03 | Update task   | M        |
| TASK-04 | Delete task   | M        |
| TASK-05 | Archive task  | S        |

---

## Feature 2.2 – Task Organization

| ID      | Task           | Priority |
| ------- | -------------- | -------- |
| TASK-06 | Set due date   | M        |
| TASK-07 | Set priority   | M        |
| TASK-08 | Update status  | M        |
| TASK-09 | Search tasks   | M        |
| TASK-10 | Filter tasks   | S        |
| TASK-11 | Sort task list | S        |

---

# Epic 3 – Categories

**Goal**

Organize tasks into logical groups.

## Feature 3.1 – Category Management

| ID     | Task                         | Priority |
| ------ | ---------------------------- | -------- |
| CAT-01 | Create category              | M        |
| CAT-02 | Edit category                | M        |
| CAT-03 | Delete category              | M        |
| CAT-04 | Associate task with category | M        |
| CAT-05 | List categories              | M        |

---

# Epic 4 – Collaboration

**Goal**

Enable multiple users to work together on shared tasks.

## Feature 4.1 – Task Assignment

| ID     | Task                   | Priority |
| ------ | ---------------------- | -------- |
| COL-01 | Assign task            | M        |
| COL-02 | Remove assignment      | S        |
| COL-03 | Display assigned users | M        |

---

## Feature 4.2 – Comments

| ID     | Task                    | Priority |
| ------ | ----------------------- | -------- |
| COL-04 | Create comment          | M        |
| COL-05 | Edit comment            | S        |
| COL-06 | Delete comment          | S        |
| COL-07 | Display task discussion | M        |

---

## Feature 4.3 – Notifications

| ID     | Task                   | Priority |
| ------ | ---------------------- | -------- |
| COL-08 | Notify task assignment | S        |
| COL-09 | Notify task updates    | S        |
| COL-10 | Notify mentions        | C        |

---

# Epic 5 – Streaming Media Attachments

**Goal**

Allow users to attach and stream multimedia directly from tasks.

## Feature 5.1 – Upload Media

| ID       | Task                          | Priority |
| -------- | ----------------------------- | -------- |
| MEDIA-01 | Upload video                  | M        |
| MEDIA-02 | Upload audio                  | M        |
| MEDIA-03 | Validate supported formats    | M        |
| MEDIA-04 | Store files in object storage | M        |
| MEDIA-05 | Save metadata                 | M        |

---

## Feature 5.2 – Streaming Playback

| ID       | Task                          | Priority |
| -------- | ----------------------------- | -------- |
| MEDIA-06 | Generate secure streaming URL | M        |
| MEDIA-07 | Video player                  | M        |
| MEDIA-08 | Audio player                  | M        |
| MEDIA-09 | Playback controls             | M        |
| MEDIA-10 | Seek support                  | M        |
| MEDIA-11 | Adaptive streaming            | S        |
| MEDIA-12 | Display metadata              | S        |

---

## Feature 5.3 – Media Management

| ID       | Task                | Priority |
| -------- | ------------------- | -------- |
| MEDIA-13 | Delete attachment   | M        |
| MEDIA-14 | Replace attachment  | S        |
| MEDIA-15 | Generate thumbnails | S        |

---

# Epic 6 – Reports & Dashboard

**Goal**

Provide visibility into project progress.

## Feature 6.1 – Reports

| ID     | Task                   | Priority |
| ------ | ---------------------- | -------- |
| REP-01 | Completed tasks report | M        |
| REP-02 | Pending tasks report   | M        |
| REP-03 | Tasks by category      | M        |
| REP-04 | Export reports         | S        |

---

## Feature 6.2 – Dashboard

| ID     | Task                    | Priority |
| ------ | ----------------------- | -------- |
| REP-05 | Display task statistics | S        |
| REP-06 | Progress visualization  | S        |
| REP-07 | Productivity indicators | C        |

---

# Epic 7 – Security

**Goal**

Protect users and application resources.

## Feature 7.1 – Authorization

| ID     | Task                      | Priority |
| ------ | ------------------------- | -------- |
| SEC-01 | Role-based access control | M        |
| SEC-02 | Permission validation     | M        |
| SEC-03 | Protect private tasks     | M        |

---

## Feature 7.2 – Data Protection

| ID     | Task                     | Priority |
| ------ | ------------------------ | -------- |
| SEC-04 | HTTPS enforcement        | M        |
| SEC-05 | Encrypt stored passwords | M        |
| SEC-06 | Secure media access      | M        |
| SEC-07 | Validate upload size     | M        |

---

# Epic 8 – Infrastructure & Platform

**Goal**

Deploy a scalable serverless distributed application.

## Feature 8.1 – Cloud Infrastructure

| ID     | Task                                    | Priority |
| ------ | --------------------------------------- | -------- |
| INF-01 | Configure API Gateway                   | M        |
| INF-02 | Deploy Lambda functions                 | M        |
| INF-03 | Configure object storage                | M        |
| INF-04 | Configure database                      | M        |
| INF-05 | Configure IAM roles                     | M        |
| INF-06 | Provision infrastructure with Terraform | M        |

---

## Feature 8.2 – CI/CD

| ID     | Task                      | Priority |
| ------ | ------------------------- | -------- |
| INF-07 | Configure GitHub Actions  | S        |
| INF-08 | Automated deployment      | S        |
| INF-09 | Infrastructure validation | S        |

---

## Feature 8.3 – Observability

| ID     | Task                    | Priority |
| ------ | ----------------------- | -------- |
| INF-10 | Centralized logging     | S        |
| INF-11 | Metrics collection      | S        |
| INF-12 | Distributed tracing     | C        |
| INF-13 | Cloud monitoring alerts | C        |

---

# Epic 9 – Quality Assurance

**Goal**

Ensure application reliability and maintainability.

## Feature 9.1 – Testing

| ID    | Task              | Priority |
| ----- | ----------------- | -------- |
| QA-01 | Unit tests        | M        |
| QA-02 | Integration tests | M        |
| QA-03 | API tests         | S        |
| QA-04 | End-to-end tests  | S        |

---

## Feature 9.2 – Documentation

| ID    | Task                       | Priority |
| ----- | -------------------------- | -------- |
| QA-05 | API documentation          | M        |
| QA-06 | Architecture documentation | M        |
| QA-07 | Deployment guide           | S        |
| QA-08 | User manual                | C        |

---

# MVP Backlog

The following items constitute the **Minimum Viable Product (MVP)** required to satisfy the technical challenge.

| Epic            | Included Features                                                   |
| --------------- | ------------------------------------------------------------------- |
| Authentication  | Registration, login, JWT authentication                             |
| Task Management | Full CRUD, priorities, due dates, status updates, search            |
| Categories      | Category CRUD and task association                                  |
| Collaboration   | Task assignment and comments                                        |
| Streaming Media | Upload video/audio, secure streaming, playback, metadata management |
| Reports         | Completed, pending, and category-based reports                      |
| Security        | Role-based access, HTTPS, secure media access                       |
| Infrastructure  | API Gateway, Lambda, database, object storage, IAM, Terraform       |
| Quality         | Unit and integration testing, API and architecture documentation    |

---

# Product Roadmap by Release

| Release             | Scope                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Release 1 (MVP)** | Authentication, Task CRUD, Categories, Assignments, Comments, Streaming Attachments, Basic Reports, Serverless Infrastructure |
| **Release 2**       | Notifications, Dashboard, Password Recovery, CI/CD Automation, Media Thumbnails, Report Export                                |
| **Release 3**       | Adaptive Streaming, Advanced Analytics, Distributed Tracing, Productivity Indicators, User Manual                             |

This backlog provides a clear hierarchy from business goals (epics) to deliverable capabilities (features) and actionable implementation work (tasks), while prioritizing an MVP that fully satisfies the challenge requirements for a distributed, serverless Node.js application with collaborative task management and streaming media support.
