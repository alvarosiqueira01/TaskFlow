# Serverless Infrastructure Specification
**Distributed Task Manager with Streaming Media**

## 1. Architecture Overview
This cloud-native, serverless task management platform follows a distributed event-driven microservices architecture deployed on AWS. 

The architecture is built for **Production Readiness (AWS Well-Architected)**, ensuring high availability, least-privilege security, strict observability, and cost-optimized scaling.

## 2. AWS Resources & Deployment Strategy

### Compute, Integration & API
* **Amazon API Gateway (HTTP API):** Single entry point with a JWT Authorizer. Uses dynamically generated routes per microservice (`/auth`, `/tasks`, `/categories`, etc.). CORS is strictly bound to allowed origins.
* **AWS Lambda (Node.js 22.x):** Hosts seven distinct microservices. Configured with explicit memory tuning, timeouts, and DLQs. 
* **Amazon EventBridge & SQS:** Custom Event Bus handles a comprehensive domain event catalog (`UserRegistered`, `TaskCreated`, `MediaUploaded`, etc.). Multiple consumers (Reporting, Notifications, Collaboration) are mapped to these rules with SQS Dead Letter Queues (DLQs).

### Storage & Database
* **Amazon Aurora Serverless v2 (PostgreSQL):** Multi-AZ deployment (2+ cluster instances) with automated backups, Performance Insights, storage encryption (KMS), and deletion protection. 
* **Amazon RDS Proxy:** Connection pooling to prevent database starvation from Lambda scaling.
* **Amazon S3 (`media-bucket`):** Object storage secured with Block Public Access and KMS encryption. Includes **Lifecycle Transitions** (Standard → IA → Glacier) for cost optimization.
* **Amazon CloudFront:** CDN configured with Origin Access Control (OAC), WAFv2, and Key Groups for Signed URLs.

### Networking, Security & Observability
* **Amazon VPC:** Multi-AZ private subnets. Uses **Interface VPC Endpoints** for AWS services (Secrets Manager, EventBridge, etc.) and a **Gateway VPC Endpoint** for S3 to eliminate NAT Gateway costs and keep traffic on the AWS backbone.
* **Security & IAM:** Strict least-privilege IAM policies. Lambdas are only granted access to the specific Secret ARNs and Event Bus ARNs they require.
* **Observability:** Centralized AWS CloudWatch Alarms for Lambda errors, API 5XX errors, and RDS CPU utilization. SNS topics alert administrators to infrastructure anomalies. X-Ray is enabled for distributed tracing.
* **CI/CD & IaC:** Terraform uses an S3 remote backend with DynamoDB state locking and strict provider version pinning.

## 3. Environment Variables

| Variable Name | Description | Used By |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment name (e.g., `production`, `staging`) | All |
| `DB_PROXY_ENDPOINT` | RDS Proxy Endpoint | All |
| `DB_NAME` | Database name | All |
| `DB_SECRET_ARN` | ARN of the DB credentials secret | All |
| `JWT_SECRET_ARN` | ARN of the JWT secret | `AuthService` |
| `EVENT_BUS_NAME` | Name of the custom EventBridge bus | All |
| `MEDIA_BUCKET_NAME` | S3 bucket for media attachments | `MediaService` |
| `CLOUDFRONT_DOMAIN` | Domain name of the CloudFront distribution | `MediaService` |
| `CF_KEY_GROUP_ID` | CloudFront Key Group ID | `MediaService` |
| `CF_PRIVATE_KEY_SECRET` | Secret ARN containing the CloudFront private key | `MediaService` |