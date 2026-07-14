# Product Requirements Document (PRD) – Distributed Task Manager with Streaming Attachments

## 1. Product Vision

Develop a cloud-native task management platform that enables individuals and teams to organize work, collaborate efficiently, and enrich tasks with streaming video/audio attachments. The application must be built using Node.js, follow a distributed architecture, and be deployed entirely in a serverless AWS environment using AWS Lambda.

Unlike traditional CRUD task managers, this solution emphasizes scalable event-driven architecture and efficient media streaming without requiring users to download large files.

---

# 2. Product Objectives

## Business Objectives

* Deliver a modern collaborative task management platform.
* Demonstrate cloud-native architecture using AWS Serverless services.
* Support scalable collaboration between multiple users.
* Enable rich media communication through streaming attachments.
* Maintain low operational costs through serverless infrastructure.

---

## Technical Objectives

* Distributed microservice architecture.
* Stateless backend services.
* Event-driven communication.
* Horizontal scalability.
* Infrastructure as Code.
* Cloud-native deployment.
* Media streaming support.

---

# 3. Stakeholders

* End Users
* Team Members
* Project Managers
* System Administrators
* DevOps Engineers
* Product Owner

---

# 4. Actors

## Primary Actors

### Guest

Can:

* Register
* Login

---

### Authenticated User

Can:

* Create tasks
* Edit tasks
* Delete tasks
* Complete tasks
* Upload media attachments
* Stream media attachments
* Comment on tasks
* Assign tasks
* View reports

---

### Team Member

Can:

* View shared tasks
* Update assigned tasks
* Watch streaming attachments
* Comment

---

### Project Manager

Additional permissions:

* Manage categories
* Assign tasks
* View dashboards
* Generate reports

---

### Administrator

Can:

* Manage users
* Monitor platform
* Manage permissions
* View logs
* Configure system

---

# 5. Problem Statement

Current lightweight task managers usually support file attachments only as downloadable files. Large videos increase storage costs and provide poor user experience.

The proposed system introduces streaming media attachments so users can instantly watch or listen to recordings related to tasks.

Examples:

* Bug reproduction videos
* Meeting recordings
* Voice notes
* Screen recordings
* Demonstrations

---

# 6. Scope

## In Scope

User Management

* Registration
* Authentication
* Authorization

Task Management

* CRUD
* Status
* Due dates
* Priorities
* Categories

Collaboration

* Comments
* Assignments
* Shared tasks

Media

* Upload
* Streaming playback
* Metadata

Reports

* Task completion
* Progress
* Productivity

Notifications

* Assignment
* Status updates

---

## Out of Scope

* Video editing
* Live streaming
* Video conferencing
* Chat
* AI recommendations
* OCR
* Face recognition

---

# 7. Functional Requirements

## Authentication

### FR-01

The system shall allow users to register.

---

### FR-02

The system shall authenticate users using JWT.

---

### FR-03

The system shall allow password recovery.

---

## User Management

### FR-04

The system shall allow users to edit profiles.

---

### FR-05

The system shall manage user roles.

---

## Task Management

### FR-06

Users shall create tasks.

---

### FR-07

Users shall edit tasks.

---

### FR-08

Users shall delete tasks.

---

### FR-09

Users shall archive tasks.

---

### FR-10

Users shall categorize tasks.

---

### FR-11

Users shall define priorities.

---

### FR-12

Users shall define due dates.

---

### FR-13

Users shall update task status.

Possible status:

* Backlog
* To Do
* In Progress
* Review
* Completed

---

### FR-14

Users shall search tasks.

---

### FR-15

Users shall filter tasks.

---

### FR-16

Users shall assign tasks.

---

## Collaboration

### FR-17

Users shall comment on tasks.

---

### FR-18

Users shall mention collaborators.

---

### FR-19

Users shall receive assignment notifications.

---

## Categories

### FR-20

Users shall create categories.

---

### FR-21

Users shall edit categories.

---

### FR-22

Users shall remove categories.

---

## Streaming Attachments

### FR-23

Users shall upload video attachments.

---

### FR-24

Users shall upload audio attachments.

---

### FR-25

The system shall store media in object storage.

---

### FR-26

The system shall generate streaming URLs.

---

### FR-27

Users shall watch videos directly inside tasks.

---

### FR-28

Users shall play audio inside tasks.

---

### FR-29

Media shall support seeking.

---

### FR-30

Media playback shall adapt to network speed when possible.

---

### FR-31

The system shall generate thumbnails for videos.

---

### FR-32

The system shall display media metadata.

---

### FR-33

Users shall remove media attachments.

---

## Reports

### FR-34

Users shall view completed tasks.

---

### FR-35

Users shall view pending tasks.

---

### FR-36

Users shall view tasks by category.

---

### FR-37

Users shall export reports.

---

## Audit

### FR-38

The system shall maintain task history.

---

### FR-39

The system shall log significant actions.

---

# 8. Non-Functional Requirements

## Performance

NFR-01

API response under 500 ms for CRUD operations.

---

NFR-02

Video playback startup below 3 seconds.

---

NFR-03

Support at least 1,000 concurrent users.

---

## Scalability

NFR-04

Horizontal scaling without manual intervention.

---

NFR-05

Independent scaling of services.

---

## Availability

NFR-06

99.9% uptime.

---

## Reliability

NFR-07

Uploaded media shall never be lost after successful upload.

---

## Security

NFR-08

JWT authentication.

---

NFR-09

HTTPS everywhere.

---

NFR-10

Encrypted storage.

---

NFR-11

Role-based authorization.

---

## Maintainability

NFR-12

Infrastructure as Code.

---

NFR-13

Automated CI/CD.

---

NFR-14

Unit and integration testing.

---

## Observability

NFR-15

Centralized logs.

---

NFR-16

Distributed tracing.

---

NFR-17

Cloud monitoring.

---

# 9. Business Rules

* Only authenticated users may create tasks.
* Only task owners or administrators may delete tasks.
* Assigned users may update task progress.
* Media attachments belong to exactly one task.
* Deleted tasks remove associated metadata; media objects may be retained temporarily according to lifecycle policies.
* Reports only include authorized data.
* Private tasks are visible only to authorized collaborators.

---

# 10. User Stories

## Epic 1 — Authentication

### US-01

As a visitor,
I want to create an account,
so that I can use the platform.

---

### US-02

As a user,
I want to log in,
so that I can access my tasks securely.

---

## Epic 2 — Task Management

### US-03

As a user,
I want to create tasks,
so that I can organize my work.

---

### US-04

As a user,
I want to edit tasks,
so that information remains updated.

---

### US-05

As a user,
I want to complete tasks,
so that I can track my progress.

---

### US-06

As a user,
I want to categorize tasks,
so that I can organize similar work.

---

### US-07

As a user,
I want to assign tasks,
so that responsibilities are clearly defined.

---

## Epic 3 — Collaboration

### US-08

As a collaborator,
I want to comment on tasks,
so that discussions stay attached to the work item.

---

### US-09

As a collaborator,
I want to receive notifications,
so that I know when work changes.

---

## Epic 4 — Streaming Media

### US-10

As a user,
I want to upload a screen recording,
so that teammates can understand a reported issue.

---

### US-11

As a user,
I want to stream videos,
so that I do not need to download large files.

---

### US-12

As a user,
I want to stream voice recordings,
so that I can quickly hear project updates.

---

### US-13

As a user,
I want thumbnails for videos,
so that I can identify recordings easily.

---

## Epic 5 — Reports

### US-14

As a manager,
I want to view completed tasks,
so that I can monitor team productivity.

---

### US-15

As a manager,
I want reports grouped by category,
so that I can analyze workload distribution.

---

# 11. Constraints

## Technical Constraints

* Backend implemented in Node.js with Fastify - faster and lighter for serverless application; @fastify/aws-lambda or the AWS Lambda Web Adapter to make connection.
* Serverless deployment using AWS Lambda.
* Distributed architecture with independently deployable services.
* REST APIs (or GraphQL if justified).
* Infrastructure provisioned through Terraform.
* Dynamic and responsive interfaces with Vue.js, using Tailwind CSS, Material UI (Vuetify) or ShadCN-Vue; emphasis on modularity and reusability.
* Object storage for media (e.g., Amazon S3).
* Streaming delivered through pre-signed URLs and/or a CDN to avoid routing media through Lambda.
* Authentication with JWT.
* Stateless Lambda functions.
* Managed database service (e.g., Amazon RDS, Supabase, or similar) implementing PostgreSQL/Drizzle ORM.
* Version control with Git.
* Docker containerization
* CI/CD pipeline.

---

## Operational Constraints

* Pay-per-use infrastructure.
* Cold starts should be minimized.
* Secure handling of uploaded media.
* Cost-efficient storage.
* Compliance with data privacy regulations where applicable.

---

# 12. Expected Differentiators

## Functional

* Native video streaming inside tasks.
* Native audio streaming.
* Collaborative task discussions.
* Rich task metadata.
* Media previews.
* Progress dashboards.

---

## Technical

* Fully serverless architecture.
* Event-driven design.
* Independent microservices.
* Automatic scaling.
* Infrastructure as Code.
* Cloud-native deployment.
* CDN-enabled media streaming.
* Secure pre-signed media access.
* Distributed observability (logging, metrics, and tracing).

---

# 13. Suggested High-Level Architecture

| Layer                          | Responsibilities                                                              |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Frontend                       | Task management UI, authentication, media playback                            |
| API Gateway                    | Request routing, authentication, throttling                                   |
| Auth Service (Lambda)          | User registration and login                                                   |
| Task Service (Lambda)          | CRUD operations for tasks                                                     |
| Category Service (Lambda)      | Category management                                                           |
| Collaboration Service (Lambda) | Comments, assignments, notifications                                          |
| Media Service (Lambda)         | Upload orchestration, metadata, pre-signed URL generation                     |
| Reporting Service (Lambda)     | Report generation                                                             |
| Event Bus (Amazon EventBridge) | Asynchronous integration between services                                     |
| Object Storage (Amazon S3)     | Video and audio files                                                         |
| CDN (Amazon CloudFront)        | Low-latency streaming delivery                                                |
| Database                       | Persistent storage for users, tasks, categories, comments, and media metadata |
| Monitoring                     | Centralized logs, metrics, and distributed tracing                            |

This architecture satisfies the challenge requirements by combining a distributed Node.js backend deployed on AWS Lambda with serverless managed services, while treating media streaming as a first-class capability through object storage and CDN delivery rather than serving large files directly from compute functions.
