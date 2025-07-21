import { Construct } from 'constructs';
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';
import { ApplicationInsights } from '@cdktf/provider-azurerm/lib/application-insights';
import { LogAnalyticsWorkspace } from '@cdktf/provider-azurerm/lib/log-analytics-workspace';
import { KeyVault } from '@cdktf/provider-azurerm/lib/key-vault';
import { DataAzurermClientConfig } from '@cdktf/provider-azurerm/lib/data-azurerm-client-config';
import { MonitorMetricAlert } from '@cdktf/provider-azurerm/lib/monitor-metric-alert';
import { MonitorActionGroup } from '@cdktf/provider-azurerm/lib/monitor-action-group';

export interface MonitoringProps {
  resourceGroup: ResourceGroup;
  staticWebApp: any;
  environment: string;
  location: string;
  tags: Record<string, string>;
}

export class Monitoring extends Construct {
  public readonly applicationInsights: ApplicationInsights;
  public readonly logAnalyticsWorkspace: LogAnalyticsWorkspace;
  public readonly keyVault: KeyVault;
  public readonly actionGroup: MonitorActionGroup;

  constructor(scope: Construct, id: string, props: MonitoringProps) {
    super(scope, id);

    const current = new DataAzurermClientConfig(this, 'Current');

    this.logAnalyticsWorkspace = new LogAnalyticsWorkspace(this, 'LogAnalyticsWorkspace', {
      name: `law-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      location: props.resourceGroup.location,
      sku: 'PerGB2018',
      retentionInDays: 30, // Cost optimization - minimal retention
      tags: {
        ...props.tags,
        Component: 'log-analytics'
      }
    });

    this.applicationInsights = new ApplicationInsights(this, 'ApplicationInsights', {
      name: `ai-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      location: props.resourceGroup.location,
      applicationType: 'web',
      workspaceId: this.logAnalyticsWorkspace.id,
      
      dailyDataCapInGb: 1,
      samplingPercentage: 100,
      
      tags: {
        ...props.tags,
        Component: 'application-insights'
      }
    });

    this.keyVault = new KeyVault(this, 'KeyVault', {
      name: `kv-microsite-${props.environment}-${Math.random().toString(36).substring(2, 8)}`,
      resourceGroupName: props.resourceGroup.name,
      location: props.resourceGroup.location,
      
      tenantId: current.tenantId,
      skuName: 'standard',
      
      accessPolicy: [{
        tenantId: current.tenantId,
        objectId: current.objectId,
        keyPermissions: ['Get', 'List', 'Create', 'Delete', 'Update'],
        secretPermissions: ['Get', 'List', 'Set', 'Delete'],
        certificatePermissions: ['Get', 'List', 'Create', 'Delete', 'Update']
      }],

      enabledForDeployment: false,
      enabledForDiskEncryption: false,
      enabledForTemplateDeployment: true,
      purgeProtectionEnabled: false,
      softDeleteRetentionDays: 7,
      tags: {
        ...props.tags,
        Component: 'key-vault'
      }
    });

    this.actionGroup = new MonitorActionGroup(this, 'ActionGroup', {
      name: `ag-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      shortName: 'microsite',
      
      emailReceiver: [{
        name: 'platform-team',
        emailAddress: 'platform-team@company.com',
        useCommonAlertSchema: true
      }],

      tags: {
        ...props.tags,
        Component: 'action-group'
      }
    });

    new MonitorMetricAlert(this, 'UptimeAlert', {
      name: `alert-uptime-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      scopes: [props.staticWebApp.id],
      
      description: 'Alert when the microsite is down',
      severity: 0, 
      frequency: 'PT1M',
      windowSize: 'PT5M',
      
      criteria: [{
        metricNamespace: 'Microsoft.Web/staticSites',
        metricName: 'SiteHits',
        aggregation: 'Count',
        operator: 'LessThan',
        threshold: 1,
        skipMetricValidation: true
      }],

      action: [{
        actionGroupId: this.actionGroup.id
      }],
      
      tags: {
        ...props.tags,
        Component: 'alert-uptime'
      }
    });

    new MonitorMetricAlert(this, 'PerformanceAlert', {
      name: `alert-performance-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      scopes: [this.applicationInsights.id],
      
      description: 'Alert when page load time exceeds 3 seconds',
      severity: 2,
      frequency: 'PT5M',
      windowSize: 'PT15M',

      criteria: [{
        metricNamespace: 'Microsoft.Insights/components',
        metricName: 'pageViews/duration',
        aggregation: 'Average',
        operator: 'GreaterThan',
        threshold: 3000,
        skipMetricValidation: true
      }],

      action: [{
        actionGroupId: this.actionGroup.id
      }],
      
      tags: {
        ...props.tags,
        Component: 'alert-performance'
      }
    });
  }
}
