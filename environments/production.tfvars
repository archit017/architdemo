# Environment Variables for Production
resourceGroupName = "rg-microsite-production"
location = "East US 2"
environment = "production"

# Naming conventions
staticWebAppName = "swa-microsite-production"
cdnProfileName = "cdn-microsite-production"
keyVaultName = "kv-microsite-production"
applicationInsightsName = "ai-microsite-production"

# Configuration
staticWebAppSku = "Free"
cdnSku = "Standard_Microsoft"
keyVaultSku = "standard"

# Monitoring settings
logRetentionDays = 90
dailyDataCapGb = 2

# Security settings
purgeProtectionEnabled = true
softDeleteRetentionDays = 30
