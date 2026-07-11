resource "aws_sns_topic" "alerts" {
  name = "taskmanager-alerts-${var.environment}"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Create Error Alarms dynamically for every Lambda
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  for_each            = var.lambda_arns
  alarm_name          = "${each.key}-lambda-errors-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_actions       = [aws_sns_topic.alerts.arn]
  dimensions          = { FunctionName = each.key }
}