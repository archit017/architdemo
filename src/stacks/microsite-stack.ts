import { Construct } from 'constructs';
import { TerraformStack, TerraformOutput } from 'cdktf';
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider';
import { ResourceGroup } from '@cdktf/provider-azurerm/lib/resource-group';
import { StaticSite } from '../constructs/static-site';

export interface MicrositeStackProps {
  resourceGroupName: string;
  location: string;
  environment: string;
  tags: Record<string, string>;
}

export class MicrositeStack extends TerraformStack {
  public readonly staticWebApp: any;
  public readonly resourceGroup: ResourceGroup;

  constructor(scope: Construct, id: string, props: MicrositeStackProps) {
    super(scope, id);

    new AzurermProvider(this, 'AzureRm', {
      features: {}
    });

    this.resourceGroup = new ResourceGroup(this, 'ResourceGroup', {
      name: props.resourceGroupName,
      location: props.location,
      tags: props.tags
    });

    const staticSite = new StaticSite(this, 'StaticSite', {
      resourceGroup: this.resourceGroup,
      environment: props.environment,
      location: props.location,
      tags: props.tags
    });

    this.staticWebApp = staticSite.staticWebApp;

    new TerraformOutput(this, 'static-web-app-url', {
      value: this.staticWebApp.defaultHostName,
      description: 'The default URL of the static web app'
    });

    new TerraformOutput(this, 'static-web-app-name', {
      value: this.staticWebApp.name,
      description: 'The name of the static web app'
    });

    new TerraformOutput(this, 'static-web-app-api-key', {
      value: this.staticWebApp.apiKey,
      description: 'The API key for deploying to the static web app',
      sensitive: true
    });

    new TerraformOutput(this, 'resource-group-name', {
      value: this.resourceGroup.name,
      description: 'The name of the resource group'
    });
  }
}
