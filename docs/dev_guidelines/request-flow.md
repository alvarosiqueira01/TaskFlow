
## Standard Request Lifecycle

Understanding how a request travels through the stack is critical for onboarding. Here is the standard flow from the user's browser to the database and back:

1. **Browser:** User initiates an action.
2. **Vue Page:** Intercepts the user action.


3. **Pinia Store:** Coordinates the application state.


4. **Feature Service:** Maps request payloads and calls backend APIs.


5. **Axios (Core API):** Handles the outgoing HTTP communication.


6. **API Gateway:** Routes the request to the appropriate service.
7. **AWS Lambda:** Wakes up the serverless function.


8. **Fastify Controller:** Validates the request in the Presentation layer.


9. **Use Case:** Orchestrates the business logic in the Application layer.


10. **Repository:** Translates the domain command to a database query.


11. **Aurora Database:** Persists the data.
