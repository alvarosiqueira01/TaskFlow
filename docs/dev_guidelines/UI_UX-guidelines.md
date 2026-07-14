After reviewing the **Frontend Architecture Standard** you uploaded, the previous UI/UX guideline should indeed be revised. The previous version still assumed a traditional *layer-first* organization (`components/`, `pages/`, `stores/`, `services/` at the application root), while your frontend architecture adopts a **feature-based architecture** with strict dependency rules, isolated business modules, and shared generic resources. 

Below is a revised guideline that aligns with the architecture standard.

---

# UI/UX Design Guidelines

## Distributed Task Manager

### Vue 3 Frontend (Feature-Based Architecture)

---

# 1. Purpose

This document defines the UI/UX guidelines for designing screens, reusable components, layouts, and user interactions for the Vue 3 frontend.

These guidelines are intended to complement the **Frontend Architecture Standard**, ensuring that visual design, interaction patterns, and component organization remain consistent with the project's feature-based architecture, serverless backend, REST API contracts, and media streaming strategy. 

---

# 2. Design Philosophy

The interface should prioritize productivity and clarity.

Core principles:

* Feature-oriented design
* Consistent user experience
* Composition over duplication
* Progressive disclosure
* Responsive layouts
* Accessibility-first
* Predictable navigation
* Minimal cognitive load
* Fast interaction feedback

The application should resemble modern productivity software rather than traditional enterprise systems.

---

# 3. UI Architecture Alignment

The UI architecture must follow the same modular boundaries defined by the frontend architecture.

Every business feature owns:

* Pages
* Feature components
* Feature composables
* Feature store
* API service
* Types

Example:

```text
features/
└── tasks/
    ├── pages/
    ├── components/
    ├── composables/
    ├── services/
    ├── store/
    ├── types/
    └── routes.ts
```

UI components must never violate feature boundaries.

Business-specific UI remains inside its feature.

Generic UI belongs in `shared/components`.

---

# 4. Shared vs Feature Components

## Shared Components

Located in:

```text
shared/components/
```

Examples:

* Button
* Modal
* Dialog
* Card
* Avatar
* Badge
* Spinner
* EmptyState
* DataTable
* Pagination
* FormField

These components:

* contain no business rules;
* receive all behavior via props/events;
* are reusable across the application.

---

## Feature Components

Located inside their feature.

Example:

```text
features/tasks/components/
```

Examples:

* TaskCard
* TaskStatusSelector
* TaskPriorityBadge
* TaskTimeline
* TaskAttachments
* TaskEditor

These components may depend on:

* feature composables;
* feature store;
* feature types.

They must not be imported by unrelated features.

---

# 5. Screen Organization

Pages are responsible for composition only.

Pages should:

* assemble feature components;
* coordinate navigation;
* trigger composables;
* delegate persistence to services.

Pages should **not** contain business logic.

Example:

```text
TaskDetailsPage

↓

TaskHeader

TaskMetadata

TaskAttachments

CommentList

TaskHistory
```

---

# 6. Layout System

Reusable layouts belong in

```text
layouts/
```

Recommended layouts:

* AuthLayout
* DefaultLayout
* DashboardLayout
* AdminLayout

Layouts define only structural composition.

They must not depend on business features.

---

# 7. Navigation

Navigation is application infrastructure.

Feature routes are defined inside each feature:

```text
features/tasks/routes.ts

features/media/routes.ts

features/reports/routes.ts
```

The root router assembles them.

Navigation menus should derive from route metadata whenever possible.

---

# 8. Visual Design System

## Style

Clean

Minimal

Professional

Modern

Whitespace-driven

Examples of inspiration:

* Linear
* GitHub
* Notion

---

## Grid

8 px spacing system

Common values

* 8
* 16
* 24
* 32
* 48

---

## Typography

Font

Inter

Hierarchy

* Page title
* Section title
* Card title
* Body
* Caption

Consistent sizing should be defined as design tokens rather than hardcoded values.

---

# 9. Color System

Semantic colors only.

Primary

Blue

Success

Green

Warning

Amber

Error

Red

Neutral

Gray scale

Status and priority should always combine:

* color;
* icon;
* text.

Never rely solely on color.

---

# 10. Feature Screens

Each feature should expose only the screens required for its business domain.

Example:

## Auth

* Login
* Register
* Profile

---

## Dashboard

Widgets only.

No CRUD.

---

## Tasks

* Task List
* Task Details
* Task Editor

---

## Categories

* Category List
* Category Editor

---

## Collaboration

Embedded inside Task Details.

No dedicated pages.

---

## Media

Embedded in Task Details.

No standalone media management page.

---

## Reports

Read-only analytical views.

---

## Notifications

Notification Center

---

## Settings

User preferences

---

# 11. Forms

Shared form controls belong in

```text
shared/components/
```

Examples

* BaseInput
* BaseSelect
* BaseTextarea
* BaseDatePicker

Validation belongs to

```text
shared/validation/
```

Business validation belongs to feature composables.

---

# 12. Tables

The generic table component belongs to

```text
shared/components/DataTable
```

Each feature provides:

* columns;
* filters;
* actions.

The DataTable should remain unaware of business entities.

---

# 13. State Management

Global state is managed with Pinia.

Stores remain feature-specific.

Example

```text
features/tasks/store/

features/auth/store/

features/media/store/
```

Stores coordinate UI state.

Remote communication always belongs to services.

---

# 14. Service Layer

UI components never call Axios directly.

Flow:

```text
Component

↓

Composable

↓

Store

↓

Service

↓

Core API Client
```

The HTTP client is centralized in

```text
core/api/
```

---

# 15. Media Upload UX

The upload flow follows the backend streaming architecture.

```text
User selects file

↓

Generate Upload URL

↓

Upload directly to S3

↓

Confirm upload

↓

Refresh task attachments
```

The interface should display:

* upload progress;
* estimated time remaining;
* retry;
* cancel;
* success feedback.

Uploads should never block the rest of the page.

---

# 16. Media Playback UX

The player requests a streaming URL only when playback begins.

Flow:

```text
Open attachment

↓

Request signed URL

↓

Receive CloudFront URL

↓

HTML5 Player
```

Streaming URLs must never be cached in application state.

Only media metadata is persisted.

---

# 17. Loading States

Every asynchronous operation should provide immediate visual feedback.

Preferred patterns:

* Skeleton loaders
* Inline spinners
* Button loading states
* Progressive rendering

Avoid blank screens.

---

# 18. Error Handling

Errors should be localized to the affected component whenever possible.

Examples:

* inline form validation;
* attachment upload errors;
* media playback failures;
* task update failures.

Avoid full-page error dialogs except for unrecoverable failures.

---

# 19. Accessibility

Every feature must satisfy WCAG 2.1 AA requirements.

Requirements include:

* keyboard navigation;
* visible focus indicators;
* semantic HTML;
* ARIA labels;
* sufficient contrast;
* accessible dialogs;
* descriptive labels for controls.

Accessibility should be considered during component design rather than added afterward.

---

# 20. Performance Guidelines

The UI architecture should leverage the feature-based organization to optimize performance.

Recommendations:

* Route-level lazy loading.
* Lazy loading of feature pages.
* Dynamic imports for large dialogs.
* Virtual scrolling for large task lists.
* Debounced search.
* Optimistic UI updates where appropriate.
* Image lazy loading.
* Avoid unnecessary global state.

---

# 21. Dependency Rules for UI Components

UI implementation must follow the dependency rules defined by the frontend architecture:

```text
Pages
    ↓
Feature Components
    ↓
Feature Composables
    ↓
Feature Store
    ↓
Feature Services
    ↓
Core API
```

Shared resources may be consumed at any level but **must remain framework-agnostic and free of feature-specific business logic**. Features must never import components, stores, composables, or services directly from other features. Cross-feature interactions should occur through routing, shared abstractions, or backend APIs, preserving encapsulation and independent evolution. 

---

# 22. Design System Governance

To maintain long-term consistency, every new feature should:

* reuse existing shared components before creating new ones;
* promote feature components to `shared/components` only when they become generic;
* reuse design tokens for colors, spacing, typography, and elevation;
* follow consistent naming conventions for pages and components;
* keep presentation concerns separated from business logic;
* preserve the feature boundaries established by the frontend architecture.

This approach ensures that the user experience remains cohesive while the codebase scales in accordance with the project's feature-based architectural standard. 
