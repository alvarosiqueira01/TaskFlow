## Backend Naming Conventions

To maintain consistency across the domain-oriented monorepo, the following naming conventions must be strictly followed for all backend classes and files:

* **Use Cases:** Must be named with a verb phrase followed by `UseCase` (e.g., `CreateTaskUseCase`, `UpdateUserUseCase`).
* **Controllers:** Must be named after the domain entity followed by `Controller` (e.g., `TaskController`).
* **Repositories (Interfaces):** Must be named after the domain entity followed by `Repository` (e.g., `TaskRepository`). These reside in the Domain layer.


* **Repositories (Implementations):** Must append `Impl` or the technology used to the interface name (e.g., `TaskRepositoryImpl` or `DrizzleTaskRepository`). These reside in the Infrastructure layer.


* **Data Transfer Objects (DTOs):** Must append `Dto`, `Request`, or `Response` to the action or entity (e.g., `TaskDto`, `CreateTaskRequest`, `CreateTaskResponse`). These belong in the contracts directory.


* **Mappers:** Must append `Mapper` to the entity name (e.g., `TaskMapper`).
* **Events:** Must be named in the past tense to indicate something that has already happened (e.g., `TaskCreatedEvent`, `UserRegisteredEvent`).

## Frontend Naming Conventions

To ensure stylistic consistency across the feature-based architecture, follow these frontend conventions:

* **Pinia Actions:** Must use actionable verbs (e.g., `loadTasks`, `createTask`, `deleteTask`).
* **Composables:** Must begin with `use` (e.g., `useTaskFilters`, `useMediaUpload`). These encapsulate reusable behavior.


* **Vue Components:**
* **Pages:** Must append `Page` and use PascalCase (e.g., `TaskListPage.vue`).
* **Feature Components:** Must be named with specific context (e.g., `TaskCard.vue`, `TaskEditor.vue`).
* **Shared Components:** Must remain generic and configurable (e.g., `Button.vue`, `Modal.vue`).




* **Services:** Must append `Service` to the feature name (e.g., `TaskService.ts`, `AuthService.ts`).
