# Software Architecture Proposal

**Distributed Serverless Task Manager with Streaming Media**

The PRD and backlog define a cloud-native collaborative task manager whose main architectural drivers are:

* Fully serverless deployment
* Distributed microservices
* Event-driven communication
* Media streaming at scale
* Low operational cost
* Independent deployment
* High availability
* Horizontal scalability
* Stateless services
* Infrastructure as Code (Terraform)

The following architecture satisfies all functional and non-functional requirements while remaining relatively simple for an MVP.

---

# 1. Architectural Style

## Primary Architecture

**Distributed Event-Driven Microservices**

Each business domain is implemented as an independent serverless service.

Characteristics:

* Domain-driven decomposition
* Stateless compute
* REST synchronous communication
* Event-driven asynchronous integration
* Database-per-service (logical separation)
* Serverless-first infrastructure

Patterns used:

* Domain-Driven Design (DDD)
* Clean Architecture
* Repository Pattern
* Dependency Injection
* CQRS-lite (writes trigger events; reads remain REST)
* Event-Driven Architecture
* API Gateway Pattern
* Backend for Frontend (BFF optional)
* Outbox Pattern (recommended)
* Saga (future evolution if transactions become distributed)

---

# 2. High-Level Architecture

```
Vue.js SPA
      │
      ▼
API Gateway
      │
────────────────────────────────────────────
│          AWS Lambda Services             │
────────────────────────────────────────────
Auth
Tasks
Categories
Collaboration
Media
Reporting
Notification
────────────────────────────────────────────
      │
      ▼
Amazon EventBridge
      │
────────────────────────────────────────────
│      Managed Infrastructure              │
────────────────────────────────────────────
PostgreSQL
Amazon S3
CloudFront
CloudWatch
X-Ray
IAM
Terraform
```

---

# 3. Application Modules

## 3.1 Authentication Service

Responsibilities

* Register
* Login
* JWT generation
* Password hashing
* Token validation
* User profile
* RBAC

Database tables

* Users
* Roles
* UserRoles

Events Published

* UserRegistered
* UserUpdated

Consumes

* None

---

## 3.2 Task Service

Responsibilities

* CRUD
* Due dates
* Priority
* Status
* Search
* Archive

Owns

* Tasks

Publishes

* TaskCreated
* TaskUpdated
* TaskDeleted
* TaskCompleted

Consumes

* UserRegistered (optional cache)

---

## 3.3 Category Service

Responsibilities

* CRUD categories
* Associate tasks

Publishes

* CategoryCreated
* CategoryDeleted

---

## 3.4 Collaboration Service

Responsibilities

* Comments
* Assignments
* Mentions
* Notifications

Publishes

* TaskAssigned
* CommentCreated
* MentionCreated

Consumes

* TaskCreated
* TaskUpdated

---

## 3.5 Media Service

Most technically interesting module.

Responsibilities

* Upload authorization
* Metadata
* Generate pre-signed URLs
* Secure streaming
* Delete media
* Replace media

Database

MediaMetadata

S3

Stores:

* Videos
* Audio
* Thumbnails

Publishes

* MediaUploaded
* MediaDeleted
* ThumbnailGenerated

Consumes

* TaskDeleted

---

## 3.6 Reporting Service

Responsibilities

Read-only projections

Produces

* Completed Tasks
* Pending Tasks
* Category Reports
* Dashboard statistics

Consumes

Every domain event

Examples

TaskCompleted

TaskUpdated

CategoryDeleted

---

## 3.7 Notification Service

Responsibilities

* Email
* Push
* Assignment notifications

Consumes

TaskAssigned

MentionCreated

TaskCompleted

---

# 4. Layered Architecture (Inside Every Service)

```
Controller

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Database
```

---

## Controller Layer

Responsibilities

* Fastify routes
* Validation
* Authentication middleware
* DTO mapping

No business logic.

---

## Application Layer

Responsibilities

* Use Cases
* Transactions
* Authorization
* Event publication

Examples

CreateTaskUseCase

AssignTaskUseCase

UploadMediaUseCase

---

## Domain Layer

Contains

* Entities
* Value Objects
* Domain Services
* Business Rules

Example

Task

Comment

Media

Category

---

## Infrastructure Layer

Contains

Repositories

Database

S3 Client

JWT

AWS SDK

CloudFront

---

# 5. Communication Strategy

## Synchronous

REST APIs

Used for:

* Login
* CRUD
* Search
* Reports
* Upload initialization

Reason

Immediate response required.

---

## Asynchronous

Amazon EventBridge

Used for

TaskCreated

TaskUpdated

MediaUploaded

CommentCreated

AssignmentCreated

Benefits

Loose coupling

Retry

Independent scaling

Eventually consistent projections

---

# 6. Database Strategy

Recommended

Managed PostgreSQL

Using

Drizzle ORM

Logical ownership

Users

Tasks

Categories

Comments

Assignments

Media Metadata

Reports

Can be separate schemas initially.

Future

Database-per-service.

---

# 7. Serverless Strategy

Each microservice

↓

Independent Lambda

Advantages

Independent deployment

Independent scaling

Lower cost

No idle servers

Stateless

Cold start mitigation

Use

* Node.js 22+
* Fastify
* AWS Lambda Web Adapter or @fastify/aws-lambda
* Provisioned Concurrency only for latency-sensitive services (Auth, Task) if required

---

# 8. Media Streaming Strategy

The media must **never** pass through Lambda during playback.

Upload flow

```
Browser

↓

Media Service

↓

Generate Pre-signed Upload URL

↓

Upload directly to S3

↓

Metadata saved

↓

Event published
```

Playback

```
Browser

↓

Media Service

↓

Generate Secure Read URL

↓

CloudFront

↓

S3
```

Benefits

* No Lambda bandwidth
* CDN caching
* HTTP Range support
* Fast seeking
* Lower cost

Adaptive streaming (Release 3)

* AWS Elemental MediaConvert or FFmpeg pipeline
* HLS playlists (`.m3u8`)
* Multiple bitrates

---

# 9. Event Catalog

| Event              | Producer      | Consumers                |
| ------------------ | ------------- | ------------------------ |
| UserRegistered     | Auth          | Task                     |
| TaskCreated        | Task          | Reporting, Collaboration |
| TaskUpdated        | Task          | Reporting                |
| TaskCompleted      | Task          | Reporting, Notification  |
| CategoryCreated    | Category      | Reporting                |
| TaskAssigned       | Collaboration | Notification             |
| CommentCreated     | Collaboration | Reporting                |
| MediaUploaded      | Media         | Reporting                |
| MediaDeleted       | Media         | Reporting                |
| ThumbnailGenerated | Media         | Frontend                 |

---

# 10. Security Architecture

Authentication

JWT

Authorization

RBAC

Transport

HTTPS only

Secrets

AWS Secrets Manager

Passwords

bcrypt

Media

Private S3 Bucket

Signed URLs

IAM

Least privilege

Encryption

S3 SSE

RDS Encryption

TLS

---

# 11. Observability

CloudWatch

* Logs
* Metrics

AWS X-Ray

* Distributed tracing

CloudWatch Alarms

* Error rate
* Lambda duration
* Throttling

Correlation ID

Generated at API Gateway

Propagated through events.

---

# 12. CI/CD

GitHub

↓

GitHub Actions

↓

Tests

↓

Terraform Plan

↓

Terraform Apply

↓

Lambda Deploy

↓

Smoke Tests

---

# 13. Recommended Project Structure

```text
services/
│
├── auth-service
├── task-service
├── category-service
├── collaboration-service
├── media-service
├── reporting-service
├── notification-service
│
shared/
│
├── domain
├── events
├── contracts
├── middleware
├── utils
│
terraform/
│
├── api-gateway
├── lambda
├── eventbridge
├── s3
├── postgres
├── iam
└── monitoring
```

---

# 14. End-to-End Data Flows

### User Registration

1. Client → API Gateway → Auth Service.
2. Auth Service validates input, hashes the password, stores the user, generates a JWT, and publishes `UserRegistered`.
3. The client receives the JWT for authenticated requests.

### Task Creation

1. Client → API Gateway → Task Service.
2. Task Service persists the task.
3. `TaskCreated` is published to EventBridge.
4. Reporting and Collaboration services update their projections asynchronously.

### Media Upload

1. Client requests an upload URL.
2. Media Service validates permissions and generates a pre-signed S3 URL.
3. Client uploads directly to S3.
4. Client confirms the upload.
5. Media Service stores metadata and publishes `MediaUploaded`.

### Media Playback

1. Client requests a streaming URL.
2. Media Service validates authorization.
3. A short-lived CloudFront/S3 signed URL is generated.
4. Browser streams directly from CloudFront, which retrieves content from S3 using HTTP range requests.

---

# Mermaid.js Architecture Diagram

````mermaid
graph TD

    A[Vue.js SPA]

    A --> B[API Gateway]

    B --> AUTH[Auth Service Lambda]
    B --> TASK[Task Service Lambda]
    B --> CAT[Category Service Lambda]
    B --> COL[Collaboration Service Lambda]
    B --> MEDIA[Media Service Lambda]
    B --> REP[Reporting Service Lambda]

    AUTH --> DB[(PostgreSQL)]
    TASK --> DB
    CAT --> DB
    COL --> DB
    MEDIA --> DB
    REP --> DB

    TASK --> EV[Amazon EventBridge]
    AUTH --> EV
    CAT --> EV
    COL --> EV
    MEDIA --> EV

    EV --> REP
    EV --> COL
    EV --> NOTIF[Notification Service Lambda]

    MEDIA --> S3[(Amazon S3)]

    A -->|Upload/Stream| CF[Amazon CloudFront]
    CF --> S3

    AUTH --> CW[CloudWatch]
    TASK --> CW
    CAT --> CW
    COL --> CW
    MEDIA --> CW
    REP --> CW
    NOTIF --> CW

    CW --> XR[AWS X-Ray]

    TF[Terraform] --> B
    TF --> AUTH
    TF --> TASK
    TF --> CAT
    TF --> COL
    TF --> MEDIA
    TF --> REP
    TF --> NOTIF
    TF --> DB
    TF --> S3
    TF --> EV
    TF --> CF
```
````
