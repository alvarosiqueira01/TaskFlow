
## Error Handling & DTO Mapping

### Error Strategy

* **Domain Layer:** Domain entities and value objects should throw specific, custom domain exceptions when business rules are violated.
* **Application Layer:** Use cases should either let domain exceptions bubble up or return explicit `Result<T>` objects for expected failure states.
* **Presentation Layer:** The Fastify routes and controllers are responsible for translating domain errors into appropriate HTTP status codes. Validation errors from Zod schemas must be intercepted and returned as `400 Bad Request`.



### DTO Mapping Flow

Transformations between layers must happen at specific boundaries to protect the core domain:

1. **HTTP JSON** is received by the Presentation layer.


2. Mapped to a **Request DTO** (validated via schemas).


3. Passed to the **Use Case**.


4. Converted to a **Domain Entity**.


5. Passed to the **Repository** for persistence.


6. Returned as a **Response DTO** back through the Presentation layer.


7. Sent out as **HTTP JSON**.
