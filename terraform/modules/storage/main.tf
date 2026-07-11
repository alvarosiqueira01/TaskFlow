resource "aws_s3_bucket" "media" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_lifecycle_configuration" "media_lifecycle" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "transition-to-ia-and-glacier"
    status = "Enabled"

    # Transition to Infrequent Access after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    # Transition to Deep Archive after 90 days for compliance
    transition {
      days          = 90
      storage_class = "DEEP_ARCHIVE"
    }
    abort_incomplete_multipart_upload { days_after_initiation = 1 }
  }
}

resource "aws_s3_bucket_public_access_block" "media_pab" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "media_versioning" {
  bucket = aws_s3_bucket.media.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_sse" {
  bucket = aws_s3_bucket.media.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_cors_configuration" "media_cors" {
  bucket = aws_s3_bucket.media.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = var.allowed_cors_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# CloudFront Signed URLs Key Group
resource "aws_cloudfront_public_key" "cf_key" {
  encoded_key = var.cf_public_key_pem
  name        = "media-key-${var.environment}"
}

resource "aws_cloudfront_key_group" "cf_group" {
  items = [aws_cloudfront_public_key.cf_key.id]
  name  = "media-key-group-${var.environment}"
}

# CloudFront WebACL (WAF)
resource "aws_wafv2_web_acl" "cf_waf" {
  name        = "cf-waf-${var.environment}"
  description = "WAF for Media CloudFront"
  scope       = "CLOUDFRONT"
  default_action { allow {} }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cfWafMetric"
    sampled_requests_enabled   = true
  }
  # Additional rules (rate limiting, managed rules) go here
}

resource "aws_cloudfront_distribution" "media_distribution" {
  enabled             = true
  web_acl_id          = aws_wafv2_web_acl.cf_waf.arn

  origin {
    domain_name              = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.media.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media.id}"
    trusted_key_groups = [aws_cloudfront_key_group.cf_group.id]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]
      cookies { forward = "none" }
    }
    viewer_protocol_policy = "redirect-to-https"
  }

  # HLS preparation
  ordered_cache_behavior {
    path_pattern     = "*.m3u8"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.media.id}"
    trusted_key_groups = [aws_cloudfront_key_group.cf_group.id]
    forwarded_values { query_string = false; cookies { forward = "none" } }
    viewer_protocol_policy = "redirect-to-https"
  }
  
  ordered_cache_behavior {
    path_pattern     = "*.ts"
    # ... identical to .m3u8 ...
  }

  viewer_certificate { cloudfront_default_certificate = true }
  restrictions { geo_restriction { restriction_type = "none" } }
}