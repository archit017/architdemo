import { Construct } from 'constructs';
import { TerraformStack, TerraformOutput } from 'cdktf';
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider';
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';
import { Monitoring } from '../constructs/monitoring';

export interface MonitoringStackProps {
  resourceGroupName: string;
  location: string;
  environment: string;
  staticWebApp: any;
  tags: Record<string, string>;
}

export class MonitoringStack extends TerraformStack {
  public readonly monitoring: Monitoring;

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id);

    new AzurermProvider(this, 'AzureRm', {
      features: {}
    });

    const resourceGroup = new ResourceGroup(this, 'ResourceGroup', {
      name: props.resourceGroupName,
      location: props.location,
      tags: props.tags
    });

    this.monitoring = new Monitoring(this, 'Monitoring', {
      resourceGroup,
      staticWebApp: props.staticWebApp,
      environment: props.environment,
      location: props.location,
      tags: props.tags
    });

    new TerraformOutput(this, 'application-insights-connection-string', {
      value: this.monitoring.applicationInsights.connectionString,
      sensitive: true,
      description: 'Application Insights connection string'
    });

    new TerraformOutput(this, 'log-analytics-workspace-id', {
      value: this.monitoring.logAnalyticsWorkspace.workspaceId,
      description: 'Log Analytics workspace ID'
    });

    new TerraformOutput(this, 'key-vault-uri', {
      value: this.monitoring.keyVault.vaultUri,
      description: 'Key Vault URI'
    });
  }
}
