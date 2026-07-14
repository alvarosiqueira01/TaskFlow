# Example of robust event routing mapped to architecture

resource "aws_cloudwatch_event_rule" "all_domain_events" {
  name           = "all-domain-events-rule"
  event_bus_name = var.bus_name
  event_pattern  = jsonencode({
    "detail-type": [
      "TaskCreated", "TaskUpdated", "TaskDeleted", "TaskAssigned",
      "MediaUploaded", "CommentCreated", "UserRegistered"
    ]
  })
}

resource "aws_cloudwatch_event_target" "notifications_target" {
  rule           = aws_cloudwatch_event_rule.all_domain_events.name
  event_bus_name = var.bus_name
  arn            = var.notifications_arn
  dead_letter_config { arn = var.dlq_arn }
}

resource "aws_cloudwatch_event_target" "reports_target" {
  rule           = aws_cloudwatch_event_rule.all_domain_events.name
  event_bus_name = var.bus_name
  arn            = var.reports_arn
  dead_letter_config { arn = var.dlq_arn }
}