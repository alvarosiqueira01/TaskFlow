# TaskFlow - Distributed Collaborative Task Manager

A cloud-native, serverless collaborative task management platform built with a distributed microservice architecture for AWS Lambda. TaskFlow enables teams to organize work, assign and track tasks, collaborate through comments and notifications, and attach streaming video and audio directly to tasks without requiring file downloads. Designed around event-driven communication, independently scalable services, and Infrastructure as Code, the platform intends to apply good cloud-native engineering practices and deliver a responsive, cost-efficient, and highly scalable user experience.

## Project Structure
- `/frontend`: Vue.js Single Page Application.
- `/backend`: Node.js 22.x Lambda microservices and shared libraries.
- `/terraform`: AWS Infrastructure as Code.
- `/docs`: Architecture specs, PRD, DBML, OpenAPI contracts, screens design and development guidelines.

## Local Development Setup

To run this distributed system locally, we use Docker Compose to mock AWS services (via LocalStack) and host our PostgreSQL databases. 

### 1. Prerequisites
* **Node.js** (v20+ recommended)
* **Docker** & **Docker Compose**
* **psql** (or a visual database client like PgAdmin for manual inspection)

### 2. Environment Variables
Before starting, you must create a `.env` file inside **each** microservice directory (`backend/app/services/<service-name>`). Ensure they are configured to point to your local PostgreSQL containers and the LocalStack endpoint (`http://localhost:4566`). Reference the `env.ts` file in each service for the specific required variables.

### 3. Spin Up Local Infrastructure
Start the local PostgreSQL instance and LocalStack (mocking S3, SES, SNS, and EventBridge):

```bash
cd backend
docker-compose up -d
```

### 4. Install Dependencies

Install all workspace dependencies from the root of the backend directory:

```bash
npm install

```

### 5. Database Initialization (Migrations & Seeds)

Since this is a microservice architecture, each service manages its own database schema. Generate the Drizzle ORM migrations, apply them, and seed the isolated databases using the automated setup script:

```bash
# Generates schemas, applies migrations, and pipes the seed SQL files 
# to their respective databases (auth_db, category_db, etc.)
npm run setup:local

```

*(Note: Under the hood, this runs `npm run db:generate:all`, `npm run db:migrate:all`, and `npm run db:seed:all`)*.

### 6. Start the Backend Microservices

Boot all Fastify microservices concurrently:

```bash
npm run start:all

```

*(If you need to run or debug a specific service in isolation, you can use the individual scripts, e.g., `npm run dev:auth` or `npm run dev:media`).*

### 7. Start the Frontend

Open a new terminal window to install dependencies and start the Vue.js SPA:

```bash
cd frontend
npm install
npm run dev

```

The application will now be fully functional and available at `http://localhost:5173`.

---

## Production Deployment (AWS)

To provision the real AWS infrastructure (RDS, Lambda, API Gateway, S3, EventBridge, CloudFront, etc.):

```bash
cd terraform
terraform init
terraform plan
terraform apply

```
