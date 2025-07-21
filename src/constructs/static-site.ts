import { Construct } from 'constructs';
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';
import { StaticWebApp } from '@cdktf/provider-azurerm/lib/static-web-app';
import { StorageAccount } from '@cdktf/provider-azurerm/lib/storage-account';

export interface StaticSiteProps {
  resourceGroup: ResourceGroup;
  environment: string;
  location: string;
  tags: Record<string, string>;
}

export class StaticSite extends Construct {
  public readonly staticWebApp: StaticWebApp;
  public readonly storageAccount: StorageAccount;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    const envPrefix = props.environment === 'production' ? 'prod' : 'stg';
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const storageAccountName = `stms${envPrefix}${randomSuffix}`;
    
    this.storageAccount = new StorageAccount(this, 'StorageAccount', {
      name: storageAccountName,
      resourceGroupName: props.resourceGroup.name,
      location: props.resourceGroup.location,
      accountTier: 'Standard',
      accountReplicationType: 'LRS',
      allowNestedItemsToBePublic: false,
      tags: {
        ...props.tags,
        Component: 'storage'
      }
    });

    this.staticWebApp = new StaticWebApp(this, 'StaticWebApp', {
      name: `swa-microsite-${props.environment}`,
      resourceGroupName: props.resourceGroup.name,
      location: props.location,
      skuTier: 'Free',
      skuSize: 'Free',
      
      appSettings: {
        'APPINSIGHTS_INSTRUMENTATIONKEY': '',
        'APPLICATIONINSIGHTS_CONNECTION_STRING': '',
        'ENVIRONMENT': props.environment,
        'VERSION': '1.0.0'
      },

      tags: {
        ...props.tags,
        Component: 'static-web-app'
      }
    });
  }
}
