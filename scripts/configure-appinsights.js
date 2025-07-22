#!/usr/bin/env node

/**
 * Script to configure Application Insights connection string in the website
 * This script reads the connection string from environment variables or Azure Static Web Apps config
 * and updates the HTML file accordingly
 */

const fs = require('fs');
const path = require('path');

// Get connection string from environment variables
const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || 
                         process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 
                         'PLACEHOLDER_INSTRUMENTATION_KEY';

const htmlFilePath = path.join(__dirname, '../website/index.html');

if (fs.existsSync(htmlFilePath)) {
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Replace the placeholder with the actual connection string
  if (connectionString !== 'PLACEHOLDER_INSTRUMENTATION_KEY') {
    htmlContent = htmlContent.replace(
      'connectionString: "InstrumentationKey=PLACEHOLDER_INSTRUMENTATION_KEY;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus2.livediagnostics.monitor.azure.com/"',
      `connectionString: "${connectionString}"`
    );
    
    console.log('✅ Application Insights connection string configured');
  } else {
    console.log('⚠️ Using placeholder connection string - Application Insights not configured');
  }
  
  fs.writeFileSync(htmlFilePath, htmlContent);
} else {
  console.error('❌ HTML file not found:', htmlFilePath);
}
