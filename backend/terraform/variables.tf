variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "environment" {
  type    = string
  default = "production"
}
variable "allowed_cors_origins" {
  type    = list(string)
  default = ["https://app.taskmanager.local"]
}
variable "jwt_issuer" { type = string }
variable "jwt_audience" { type = string }
variable "alert_email" { type = string }