
## Step-by-Step Developer Workflow

To implement a new feature consistently across the stack, developers should follow this exact sequence:

1. **Create Directories:** Create a new feature directory in the frontend (`features/`) and ensure the corresponding backend service exists.


2. **Define Contracts:** Define DTOs, Requests, and Responses in the backend `contracts/` directory.


3. **Create Schemas:** Create Zod schemas for validation in the backend `schemas/` directory and shared frontend types.


4. **Build the Domain:** Implement the core business entities and repository interfaces.


5. **Write the Use Case:** Implement the Application layer orchestration.


6. **Implement Adapters:** Build the Infrastructure layer adapters (e.g., Drizzle repositories).


7. **Expose Routes:** Add Fastify controllers and routes in the Presentation layer.


8. **Document API:** Generate OpenAPI documentation and update the consolidated docs.


9. **Backend Tests:** Write unit and integration tests.


10. **Frontend Services:** Update the frontend feature's `services/` directory to consume the new API.


11. **Frontend State:** Update the Pinia store for state management.


12. **Frontend UI:** Build components and map them to pages and routes.