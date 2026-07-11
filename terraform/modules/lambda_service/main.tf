resource "aws_iam_role" "lambda_exec" {
  name = "${var.function_name}-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17", Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" } }]
  })
}

# Base policies: VPC, X-Ray, CloudWatch
resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role = aws_iam_role.lambda_exec.name; policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
resource "aws_iam_role_policy_attachment" "lambda_xray" {
  role = aws_iam_role.lambda_exec.name; policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# Explicit Log Group with retention
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
}

# STRICT LEAST PRIVILEGE IAM POLICY
resource "aws_iam_role_policy" "lambda_strict_access" {
  name = "lambda_strict_access"
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["events:PutEvents"]
        Effect   = "Allow"
        Resource = var.event_bus_arn # Locked to specific Bus ARN
      },
      {
        Action   = ["secretsmanager:GetSecretValue"]
        Effect   = "Allow"
        Resource = var.secret_arns # Locked to specific Secret ARNs
      }
    ]
  })
}


resource "aws_lambda_function" "service" {
  function_name    = var.function_name
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = var.runtime
  memory_size      = var.memory_size
  timeout          = var.timeout
  filename         = var.artifact_path

  vpc_config {
    subnet_ids         = var.vpc_subnet_ids
    security_group_ids = var.vpc_security_group_ids
  }
  environment { variables = var.environment_vars }
}