import { Testing } from 'cdktf';
import { MicrositeStack } from '../stacks/microsite-stack';

//TODO improve unit tests to check for specific parameters in the template that should never change
describe('MicrositeStack', () => {
  it('should create a stack without errors', () => {
    const app = Testing.app();
    
    // Create the stack
    const stack = new MicrositeStack(app, 'test-stack', {
      resourceGroupName: 'rg-test',
      location: 'East US 2',
      environment: 'test',
      tags: {
        Environment: 'test',
        Project: 'microsite-test'
      }
    });

    // Basic validation - the stack should be created
    expect(stack).toBeDefined();
    expect(stack.resourceGroup).toBeDefined();
    expect(stack.staticWebApp).toBeDefined();
  });

  it('should synthesize valid Terraform configuration', () => {
    const app = Testing.app();
    
    const stack = new MicrositeStack(app, 'test-stack', {
      resourceGroupName: 'rg-test',
      location: 'East US 2',
      environment: 'test',
      tags: {
        Environment: 'test',
        Project: 'microsite-test'
      }
    });

    // Synthesize the Terraform configuration
    const synthesis = Testing.synth(stack);
    
    // Should contain basic Azure resources
    expect(synthesis).toContain('azurerm_resource_group');
    expect(synthesis).toContain('azurerm_static_web_app');
  });
});
