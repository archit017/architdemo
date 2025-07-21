# Environment Variables for Staging
resourceGroupName = "rg-microsite-staging"
location = "East US 2"
environment = "staging"

# Naming conventions
staticWebAppName = "swa-microsite-staging"
cdnProfileName = "cdn-microsite-staging"
keyVaultName = "kv-microsite-staging"
applicationInsightsName = "ai-microsite-staging"

# Configuration
staticWebAppSku = "Free"
cdnSku = "Standard_Microsoft"
keyVaultSku = "standard"

# Monitoring settings
logRetentionDays = 30
dailyDataCapGb = 1

# Security settings
purgeProtectionEnabled = false
softDeleteRetentionDays = 7
