# Azure Microsite - Terraform CDK

A production-ready public microsite built with Azure Static Web Apps and managed with Terraform CDK.

## 🏗️ Architecture


## 💰 Cost Analysis

| Service | Monthly Cost | Usage Assumption |
|---------|-------------|------------------|
| Static Web Apps | $0.00 | Free tier (100GB bandwidth) |
| Key Vault | $0.03 | <10,000 operations |
| Application Insights | $0.75 | <1GB telemetry |
| Log Analytics | $0.50 | <500MB logs |
| Storage Account | $0.20 | <1GB storage |
| **Total** | **$2.98** | **Under $5 target** |

*Assumptions: Low traffic site (~1000 page views/month)*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Azure CLI
- Terraform CDK CLI
- GitHub account

### Setup
1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd micrositedemo
   npm install
   ```

2. **Configure Azure authentication:**
   ```bash
   az login
   az account set --subscription "<your-subscription-id>"
   ```

3. **Initialize Terraform CDK:**
   ```bash
   cdktf get
   npm run build
   ```

4. **Deploy infrastructure:**
   ```bash
   npm run deploy
   ```

## 🔧 Development Workflow

### Local Development
```bash
# Build TypeScript
npm run build

# Synthesize Terraform configuration
npm run synth

# Plan deployment
cdktf plan

# Deploy to staging
cdktf deploy --auto-approve staging

# Deploy to production (requires approval)
cdktf deploy production
```

### CI/CD Pipeline
- **Pull Request**: Runs tests, linting, security scans
- **Merge to main**: Deploys to staging automatically
- **Manual trigger**: Deploys to production with approval

## 🛡️ Security Features

- **HTTPS Enforcement**: All traffic redirected to HTTPS
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **WAF Protection**: Basic attack prevention
- **Secret Management**: Azure Key Vault integration
- **Access Control**: Managed identities for service auth

## 📊 Monitoring & Observability

### Key Metrics
- **Uptime**: 99.9% SLA monitoring
- **Performance**: <2s page load time globally
- **Errors**: Real-time 4xx/5xx tracking
- **Cost**: Daily spend monitoring with alerts

### Dashboards
- **Operational**: Real-time health and performance
- **Business**: Traffic, conversions, user behavior
- **Cost**: Resource utilization and spend tracking

### Alerts
- Site down (>5min outage)
- High error rate (>5% for 10min)
- Slow performance (>3s load time)
- Cost threshold exceeded ($4.5/month) - deployed manually

## 🔄 Day 2 Operations

### Incident Response
1. **Detection**: Automated alerts via email/Slack
2. **Triage**: Check dashboards and logs
3. **Resolution**: Follow runbook procedures
4. **Post-mortem**: Document lessons learned

### Maintenance
- **Weekly**: Review performance metrics
- **Monthly**: Security and dependency updates
- **Quarterly**: Cost optimization review

### Scaling
- **Traffic spikes**: CDN handles automatic scaling
- **Global expansion**: Add new CDN endpoints
- **Feature growth**: Extend with Azure Functions

## 📁 Project Structure

```
├── src/
│   ├── main.ts              # CDK app entry point
│   ├── stacks/
│   │   ├── microsite-stack.ts   # Core infrastructure
│   │   └── monitoring-stack.ts  # Observability
│   └── constructs/
│       ├── static-site.ts       # Static Web App construct
│       └── monitoring.ts        # Monitoring construct
├── website/
│   ├── index.html           # Main marketing page
│   ├── css/style.css        # Optimized styles
│   └── js/app.js           # Progressive enhancement
├── .github/workflows/       # CI/CD pipelines
├── docs/                   # Technical documentation
└── terraform/              # Generated TF configs
```

## 🔍 Troubleshooting

### Common Issues
- **Deployment fails**: Check Azure subscription permissions
- **Site not loading**: Verify DNS and CDN configuration
- **High costs**: Review resource usage in Azure portal
- **Performance issues**: Check CDN cache status

### Support Resources
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Terraform CDK Documentation](https://learn.hashicorp.com/tutorials/terraform/cdktf)

---

**Next Steps:**
1. Customize marketing content in `website/`
2. Configure custom domain in Azure portal


