output "api_gateway_url" {
  value = module.api_gateway.api_endpoint
}
output "cloudfront_domain" {
  value = module.storage.cloudfront_domain
}
output "database_proxy_endpoint" {
  value = module.database.proxy_endpoint
}