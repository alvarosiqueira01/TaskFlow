
## Backend Testing

Test organization should mirror the application's structure.

* **Domain:** Unit tests only. Must be fast and test pure business logic.


* **Application:** Unit tests with mocked repository interfaces.


* **Infrastructure:** Integration tests against a local database or LocalStack.


* **Presentation:** API endpoint tests.
* **Contracts:** OpenAPI contract validation.
* **End-to-End (E2E):** Tests running against a deployed Lambda environment.

## Frontend Testing

* **Composables & Utils:** Unit tests for generic utility functions.


* **Stores (Pinia):** Unit tests to verify state mutations and action logic.


* **Components:** Component tests (e.g., using Vue Test Utils) for rendering and user interaction.


* **End-to-End (E2E):** Browser-based tests for critical user journeys.
