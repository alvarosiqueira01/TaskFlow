terraform {
  required_version = ">= 1.8.0"

  backend "s3" {
    bucket         = "taskmanager-tf-state-prod"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "taskmanager-tf-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "TaskManager"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}