
## Key Workflows

### 1. User Login

`Login Page` -> `Auth Store` -> `Auth Service` -> `API Gateway` -> `Auth Lambda` -> `JWT Generated` -> `Store Updates` -> `Router Guard`

### 2. Upload Media

`Upload Component` -> `Media Store` -> `Media Service` -> `Media Lambda` -> `Amazon S3` -> `EventBridge` -> `Notification Service`

### 3. Create Task

`Task Form` -> `Task Store` -> `Task Service` -> `Task Lambda` -> `Aurora Database` -> `TaskCreated Event` -> `Reports & Notifications`
