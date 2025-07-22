import { App } from 'cdktf';
import { MicrositeStack } from './stacks/microsite-stack';
import { MonitoringStack } from './stacks/monitoring-stack';

const app = new App();

const environments = {
  staging: {
    resourceGroupName: 'rg-microsite-staging',
    location: 'East US 2',
    environment: 'staging'
  },
  production: {
    resourceGroupName: 'rg-microsite-production', 
    location: 'East US 2',
    environment: 'production'
  }
};

Object.entries(environments).forEach(([envName, config]) => {
  const micrositeStack = new MicrositeStack(app, `microsite-${envName}`, {
    ...config,
    tags: {
      Environment: config.environment,
      Project: 'marketing-microsite',
      ManagedBy: 'terraform-cdk',
      CostCenter: 'marketing',
      Owner: 'platform-engineering'
    }
  });

  new MonitoringStack(app, `monitoring-${envName}`, {
    ...config,
    resourceGroupName: `rg-monitoring-${envName}`,  // Use separate resource group for monitoring
    staticWebApp: micrositeStack.staticWebApp,
    tags: {
      Environment: config.environment,
      Project: 'marketing-microsite',
      ManagedBy: 'terraform-cdk',
      Component: 'monitoring'
    }
  });
});

app.synth();
