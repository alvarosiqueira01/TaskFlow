# Backend Architecture Standard

## Overview

The backend follows a **domain-oriented monorepo (Bounded Contexts)** architecture, where each microservice represents an independent business context and can be developed, tested, and deployed independently.

Each service adopts **Clean Architecture** and **Domain-Driven Design (DDD)** to separate responsibilities and keep business logic decoupled from frameworks, infrastructure, and cloud providers.

### Principles

* Domain-oriented monorepo
* Independent microservices
* Clean Architecture
* Domain-Driven Design (DDD)
* Serverless (AWS Lambda)
* Event-Driven Architecture (Amazon EventBridge)
* Stateless Services
* Database-per-Service (future evolution)
* Infrastructure as Code (Terraform)

---

# Overall Structure

```text
backend/
│
├── services/
├── shared/
├── infrastructure/
├── scripts/
├── docs/
└── package.json
```

## `services/`

Contains all application microservices.

Each service represents an independent business domain.

Examples:

* auth-service
* task-service
* category-service
* collaboration-service
* media-service
* reporting-service
* notification-service

Every service must follow the exact same internal structure to ensure consistency, maintainability, and standardization.

---

## `shared/`

Shared library used by all services.

Its purpose is to eliminate code duplication without compromising domain independence.

It may include:

* shared contracts
* common events
* reusable middleware
* logging
* error handling
* validation utilities
* shared types
* common configuration
* OpenAPI documentation

**Important:** it must never contain business rules specific to any domain.

---

## `infrastructure/`

Contains resources shared across the entire backend.

Examples:

* Terraform
* Docker
* AWS configurations
* environment configurations
* deployment templates

This directory does not belong to any specific microservice.

---

## `scripts/`

Project automation scripts.

Examples:

* service scaffolding
* code generation
* database migrations
* Lambda packaging
* build
* deployment

---

## `docs/`

Technical architecture documentation.

It may contain:

* architecture diagrams
* ADRs (Architecture Decision Records)
* consolidated OpenAPI specification
* architectural decisions
* event documentation

---

# Internal Service Structure

Every service follows exactly the same structure.

```text
service/
│
├── src/
│
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── contracts/
│   ├── events/
│   ├── schemas/
│   ├── config/
│   └── index.ts
│
└── tests/
```

---

# Architecture Layers

## 1. Presentation

```text
presentation/
│
├── controllers/
├── routes/
├── middleware/
└── validators/
```

### Responsibility

Responsible for the application's HTTP interface.

Contains:

* Fastify routes
* controllers
* request validation
* authentication
* authorization
* DTO-to-use-case mapping

### Rules

* Must not contain business logic.
* Only receives requests and delegates execution to the Application layer.

---

## 2. Application

```text
application/
│
└── use-cases/
```

### Responsibility

Implements the application's use cases.

Examples:

* CreateTask
* UpdateTask
* RegisterUser
* UploadMedia

### Rules

Can:

* coordinate domain entities
* invoke repositories
* manage transactions
* publish events
* enforce authorization rules

Cannot:

* depend on Fastify
* depend on AWS
* depend on Drizzle
* access the database directly

This layer represents the orchestration of business logic.

---

## 3. Domain

```text
domain/
│
├── entities/
├── value-objects/
├── repositories/
└── events/
```

### Responsibility

Represents the core business domain.

Contains:

### Entities

Core business objects.

Examples:

* Task
* User
* Category
* Media

### Value Objects

Immutable objects representing domain concepts.

Examples:

* Priority
* TaskStatus
* Email

### Repository Interfaces

Contracts used by the Application layer.

Never implementations.

### Domain Events

Events produced by the domain.

Examples:

* TaskCreated
* UserRegistered

### Rules

The Domain layer:

* has no knowledge of databases
* has no knowledge of AWS
* has no knowledge of HTTP
* has no knowledge of frameworks

It must remain completely independent.

---

## 4. Infrastructure

```text
infrastructure/
│
├── database/
│   └── drizzle/
│
├── repositories/
│
├── events/
│   └── eventbridge/
│
├── storage/
│   ├── s3/
│   └── cloudfront/
│
└── jwt/
```

### Responsibility

Implements all external integrations.

Examples:

* Drizzle ORM
* PostgreSQL
* EventBridge
* Amazon S3
* Amazon CloudFront
* JWT
* AWS SDK

### Rules

All technology-specific dependencies belong in this layer.

It implements the interfaces defined by the Domain layer.

---

# Contracts

```text
contracts/
```

Contains the public contracts exposed by the service.

Examples:

* DTOs
* Requests
* Responses
* Public interfaces

Serves as the integration boundary between services and their consumers.

---

# Events

```text
events/
```

Contains definitions of the events published and consumed by the service.

Includes:

* payload definitions
* schemas
* versioning
* mappings

---

# Schemas

```text
schemas/
```

Centralizes validation schemas.

Examples:

* Zod
* JSON Schema
* OpenAPI Schema

Keeps validation concerns separate from business logic.

---

# Config

```text
config/
```

Service-specific configuration.

Examples:

* environment variables
* constants
* Fastify configuration
* AWS configuration
* dependency initialization

---

# Tests

```text
tests/
```

Contains the service's test suite.

May include:

* unit tests
* integration tests
* contract tests
* end-to-end tests

The test organization should mirror the application's structure.

---

# `index.ts`

Application entry point.

Responsible for:

* starting Fastify
* registering plugins
* configuring routes
* initializing dependency injection
* adapting the application to run on AWS Lambda

---

# Layer Dependencies

Dependencies flow in only one direction:

```text
Presentation
        │
        ▼
Application
        │
        ▼
Domain
        ▲
        │
Infrastructure
```

The **Domain** layer remains isolated and independent. The **Infrastructure** layer implements the contracts defined by the Domain, while **Presentation** adapts incoming requests and outgoing responses, and **Application** orchestrates the use cases. This organization ensures low coupling, high testability, and enables each service to evolve independently.
