resource "aws_apigatewayv2_api" "api" {
  name          = var.api_name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = var.allowed_cors_origins # Strict CORS
    allow_methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type", "Idempotency-Key"]
  }
}

# Dynamic Route Generation for all microservices
resource "aws_apigatewayv2_integration" "service_integrations" {
  for_each           = var.lambda_arns
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = each.value
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "service_routes" {
  for_each           = var.lambda_arns
  api_id             = aws_apigatewayv2_api.api.id
  route_key          = "ANY /${each.key}/{proxy+}" # maps to /tasks, /auth, etc.
  target             = "integrations/${aws_apigatewayv2_integration.service_integrations[each.key].id}"
  authorization_type = each.key == "auth" ? "NONE" : "JWT"
  authorizer_id      = each.key == "auth" ? null : aws_apigatewayv2_authorizer.jwt.id
}

resource "aws_apigatewayv2_authorizer" "jwt" {
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "jwt-authorizer"
  jwt_configuration {
    audience = [var.jwt_audience]
    issuer   = var.jwt_issuer
  }
}

resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/vendedlogs/apigateway/${var.api_name}"
  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format          = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }
}
