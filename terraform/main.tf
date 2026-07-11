module "network" {
  source      = "./modules/network"
  vpc_cidr    = "10.0.0.0/16"
  region      = var.aws_region
  environment = var.environment
}

module "security" {
  source      = "./modules/security"
  environment = var.environment
}

module "database" {
  source             = "./modules/database"
  vpc_id             = module.network.vpc_id
  private_subnet_ids = module.network.private_subnet_ids
  db_sg_id           = module.network.rds_sg_id
  lambda_sg_id       = module.network.lambda_sg_id
  environment        = var.environment
}

module "storage" {
  source               = "./modules/storage"
  bucket_name          = "taskmanager-media-${var.environment}"
  allowed_cors_origins = var.allowed_cors_origins
  environment          = var.environment
}

module "event_bus" {
  source      = "./modules/event_bus/routing"
  bus_name    = "taskmanager-bus-${var.environment}"
  environment = var.environment
}

locals {
  shared_env = {
    NODE_ENV          = var.environment
    DB_PROXY_ENDPOINT = module.database.proxy_endpoint
    DB_NAME           = module.database.db_name
    DB_SECRET_ARN     = module.database.secret_arn
    EVENT_BUS_NAME    = module.event_bus.bus_name
  }
  
  services = ["auth", "tasks", "categories", "collaboration", "media", "notifications", "reports"]
}

# Deploy all 7 Microservices
module "lambdas" {
  source   = "./modules/lambda_service"
  for_each = toset(local.services)

  function_name          = "${each.key}-service-${var.environment}"
  artifact_path          = "${path.root}/dist/${each.key}.zip"
  runtime                = "nodejs22.x"
  memory_size            = 256
  timeout                = 10
  vpc_subnet_ids         = module.network.private_subnet_ids
  vpc_security_group_ids = [module.network.lambda_sg_id]
  environment_vars       = merge(local.shared_env, {
    DB_SECRET_ARN = module.database.secret_arn
  })
  
  # Strict Least Privilege
  event_bus_arn  = module.event_bus.bus_arn
  secret_arns    = [module.database.secret_arn] 
}

# Apply Media Service Specific Policies & Env Vars
resource "aws_lambda_environment" "media_env" {
  function_name = module.lambdas["media"].function_name
  variables = merge(local.shared_env, {
    MEDIA_BUCKET_NAME     = module.storage.bucket_name
    CLOUDFRONT_DOMAIN     = module.storage.cloudfront_domain
    CF_KEY_GROUP_ID       = module.storage.key_group_id
    CF_PRIVATE_KEY_SECRET = module.security.cf_private_key_arn
  })
}

resource "aws_iam_role_policy" "media_s3_access" {
  name = "media_s3_access"
  role = module.lambdas["media"].role_name
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = [
        "s3:PutObject", "s3:GetObject", "s3:DeleteObject", 
        "s3:AbortMultipartUpload", "s3:ListBucket", "s3:GetObjectAttributes"
      ]
      Effect = "Allow"
      Resource = ["${module.storage.bucket_arn}", "${module.storage.bucket_arn}/*"]
    }]
  })
}

# Connect asynchronous services to EventBridge rules
resource "aws_cloudwatch_event_target" "reports_target" {
  rule      = module.event_bus.task_events_rule_name
  event_bus_name = module.event_bus.bus_name
  arn       = module.lambdas["reports"].function_arn
  dead_letter_config {
    arn = module.event_bus.dlq_arn
  }
}

module "api_gateway" {
  source               = "./modules/api_gateway"
  api_name             = "taskmanager-api-${var.environment}"
  lambda_arns          = { for k, v in module.lambdas : k => v.function_arn }
  allowed_cors_origins = var.allowed_cors_origins
  jwt_issuer           = var.jwt_issuer
  jwt_audience         = var.jwt_audience
  environment          = var.environment
}