
## Backend Dependency Injection Strategy

The backend utilizes dependency injection to ensure the Domain layer remains independent and decoupled from infrastructure.

* **Constructor Injection:** All application use cases must use constructor injection to receive their dependencies. Never instantiate repositories or infrastructure adapters inside a use case.
* **Composition Root:** Dependencies must be registered and initialized within the `index.ts` file of each service.


* **Implementation Rule:** The Application layer must only depend on the repository interfaces defined in the Domain layer, while the Infrastructure layer provides the actual implementation.



### Coding Example

```typescript
class CreateTaskUseCase {
  constructor(
    private readonly repository: TaskRepository,
    private readonly publisher: EventPublisher
  ) {}

  async execute(command: CreateTaskCommand) {
    const task = Task.create(command);
    await this.repository.save(task);
    await this.publisher.publish(new TaskCreated(task.id));
  }
}

```
