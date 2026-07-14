resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier          = "taskmanager-db-${var.environment}"
  engine                      = "aurora-postgresql"
  engine_mode                 = "provisioned"
  engine_version              = "15.3"
  database_name               = "taskmanager"
  master_username             = "postgres_admin"
  manage_master_user_password = true 
  db_subnet_group_name        = aws_db_subnet_group.aurora.name
  vpc_security_group_ids      = [var.db_sg_id]
  
  # Production settings
  storage_encrypted           = true
  deletion_protection         = true
  backup_retention_period     = 7
  preferred_backup_window     = "02:00-03:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"

  serverlessv2_scaling_configuration {
    max_capacity = 16.0
    min_capacity = 0.5
  }
}

resource "aws_rds_cluster_instance" "aurora_instances" {
  count                   = 2
  identifier              = "taskmanager-instance-${count.index}-${var.environment}"
  cluster_identifier      = aws_rds_cluster.aurora_cluster.id
  instance_class          = "db.serverless"
  engine                  = aws_rds_cluster.aurora_cluster.engine
  engine_version          = aws_rds_cluster.aurora_cluster.engine_version
  db_subnet_group_name    = aws_db_subnet_group.aurora.name
  performance_insights_enabled = true
}

# RDS Proxy for connection pooling
resource "aws_db_proxy" "proxy" {
  name                   = "taskmanager-proxy-${var.environment}"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.proxy_role.arn
  vpc_security_group_ids = [var.db_sg_id]
  vpc_subnet_ids         = var.private_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    iam_auth    = "DISABLED"
    secret_arn  = aws_rds_cluster.aurora_cluster.master_user_secret[0].secret_arn
  }
}

resource "aws_db_proxy_default_target_group" "target" {
  db_proxy_name = aws_db_proxy.proxy.name
  connection_pool_config {
    max_connections_percent = 90
  }
}

resource "aws_db_proxy_target" "cluster_target" {
  db_cluster_identifier  = aws_rds_cluster.aurora_cluster.id
  db_proxy_name          = aws_db_proxy.proxy.name
  target_group_name      = aws_db_proxy_default_target_group.target.name
}