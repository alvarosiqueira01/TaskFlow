# Frontend Architecture Standard

## Overview

The frontend follows a **feature-based architecture**, where each feature encapsulates its own UI components, business logic, state management, and service layer.

This organization promotes high cohesion, low coupling, and enables independent evolution of application features while keeping shared concerns centralized.

The application is built with **Vue.js**, leveraging the **Composition API** and a modular architecture to ensure scalability, maintainability, and testability.

### Principles

* Feature-Based Architecture
* Modular Design
* Composition API
* Separation of Concerns
* Reusable UI Components
* Centralized Shared Resources
* Route-Based Code Splitting
* Type Safety (TypeScript)
* API-First Integration
* Scalable Folder Organization

---

# Overall Structure

```text
frontend/
│
├── public/
├── src/
├── core/
├── shared/
├── features/
├── layouts/
├── router/
├── App.vue
└── main.ts
```

---

## `public/`

Contains static assets served directly by the web server.

Examples:

* favicon
* images
* fonts
* manifest
* robots.txt

Files in this directory are not processed by the build system.

---

## `src/`

Contains the application's source code.

The source code is organized into independent modules according to their responsibility.

---

## `core/`

Contains the application's core infrastructure.

Unlike features, the contents of this directory are application-wide and are initialized only once.

Examples include:

* API client
* authentication
* application configuration
* plugins
* routing infrastructure

This directory should not contain feature-specific business logic.

---

### `core/api/`

Contains the HTTP client configuration.

Examples:

* Axios instance
* request interceptors
* response interceptors
* authentication interceptor
* error handling

Responsible for centralizing communication with backend services.

---

### `core/auth/`

Contains authentication and authorization infrastructure.

Examples:

* JWT management
* token persistence
* permission evaluation
* role checking

Provides reusable authentication utilities for the entire application.

---

### `core/config/`

Contains application configuration.

Examples:

* environment configuration
* API endpoints
* feature flags
* runtime configuration

---

### `core/constants/`

Contains application-wide constants.

Examples:

* route names
* storage keys
* HTTP status codes
* permission identifiers

---

### `core/plugins/`

Contains Vue plugin registration.

Examples:

* Pinia
* Vue Router
* Vue I18n
* Toast notifications
* UI libraries

Plugins are initialized during application startup.

---

### `core/router/`

Contains routing infrastructure shared by the application.

Examples:

* navigation guards
* authentication guards
* permission guards
* route middleware

Responsible only for routing infrastructure.

---

## `shared/`

Contains reusable resources shared across multiple features.

Its purpose is to eliminate duplication while preserving feature independence.

It may contain:

* reusable UI components
* composables
* directives
* utility functions
* shared types
* validation helpers

**Important:** shared resources must remain generic and must not contain business logic specific to any feature.

---

### `shared/components/`

Reusable presentation components.

Examples:

* Button
* Modal
* Card
* DataTable
* Avatar
* LoadingSkeleton

Components should be generic and configurable.

---

### `shared/composables/`

Reusable Composition API logic.

Examples:

* usePagination
* useDebounce
* useLocalStorage
* useInfiniteScroll

Composables should encapsulate reusable behavior without depending on feature-specific implementations.

---

### `shared/directives/`

Reusable Vue directives.

Examples:

* click-outside
* autofocus
* permission

---

### `shared/types/`

Shared TypeScript types and interfaces.

Examples:

* API response models
* pagination models
* generic utility types

---

### `shared/utils/`

General-purpose utility functions.

Examples:

* date formatting
* string utilities
* number formatting
* object manipulation

Utilities must remain framework-independent whenever possible.

---

### `shared/validation/`

Reusable validation schemas and helpers.

Examples:

* Zod schemas
* form validation rules
* reusable validators

Validation logic should remain independent from feature implementations.

---

# Features

```text
features/
│
├── auth/
├── tasks/
├── categories/
├── collaboration/
├── media/
├── reports/
├── notifications/
├── dashboard/
├── users/
└── settings/ [administraticve role management]
```

Each directory represents an independent business feature.

Features encapsulate everything required to implement their functionality.

Whenever possible, changes to a feature should remain isolated within its directory.

---

# Internal Feature Structure

Every feature follows the same organization.

```text
feature/
│
├── components/
├── pages/
├── services/
├── store/
├── composables/
├── types/
└── routes.ts
```

Not every feature is required to include all directories, but the structure should remain consistent whenever they are needed.

---

## `components/`

Contains UI components specific to the feature.

Examples:

* TaskCard
* TaskEditor
* CategorySelector

These components should not be reused outside the feature unless they become generic enough to be moved into `shared/components`.

---

## `pages/`

Contains page-level components mapped directly to routes.

Pages compose feature components and coordinate user interactions.

They should contain minimal business logic.

---

## `services/`

Contains API communication for the feature.

Examples:

* TaskService
* AuthService
* MediaService

Responsibilities include:

* calling backend APIs
* mapping request payloads
* transforming responses
* encapsulating HTTP communication

Services should not manage UI state.

---

## `store/`

Contains feature-specific state management.

Implemented using Pinia.

Examples:

* authentication state
* task filters
* selected task
* dashboard state

Stores coordinate application state but should delegate persistence and remote communication to services.

---

## `composables/`

Contains reusable logic specific to the feature.

Examples:

* useTaskFilters
* useUploadMedia
* useTaskSelection

Unlike shared composables, these may depend on the feature's store or services.

---

## `types/`

Contains types specific to the feature.

Examples:

* DTOs
* API models
* form models
* enums

Feature types should remain isolated unless shared by multiple features.

---

## `routes.ts`

Defines the routes belonging to the feature.

Each feature is responsible for exposing its own route definitions.

The application's root router imports these definitions and assembles the complete routing configuration.

---

# Layouts

```text
layouts/
```

Contains reusable application layouts.

Examples:

* DefaultLayout
* AuthLayout
* DashboardLayout
* AdminLayout

Layouts define the structural organization of pages while remaining independent from feature implementations.

---

# Router

```text
router/
```

Contains the application's root routing configuration.

Responsibilities include:

* assembling feature routes
* configuring lazy loading
* registering global navigation guards
* creating the Vue Router instance

Business logic should not reside in the router.

---

# App.vue

The root application component.

Responsible for:

* rendering the root layout
* mounting global providers
* hosting the router view

It should remain lightweight.

---

# main.ts

Application entry point.

Responsible for:

* creating the Vue application
* registering plugins
* initializing Pinia
* configuring Vue Router
* mounting the application

No business logic should exist in this file.

---

# Dependency Rules

Dependencies should follow a single direction.

```text
Pages
      │
      ▼
Feature Components
      │
      ▼
Composables / Store
      │
      ▼
Services
      │
      ▼
Core API
```

Shared resources may be consumed by any layer.

Features must never depend directly on one another. Communication between features should occur through shared abstractions, application routing, or backend APIs.

This dependency flow ensures strong encapsulation, low coupling, high maintainability, and allows each feature to evolve independently without introducing unnecessary cross-feature dependencies.
