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

// Check for dist/website first (during deployment), fallback to website (during development)
const distHtmlPath = path.join(__dirname, '../dist/website/index.html');
const sourceHtmlPath = path.join(__dirname, '../website/index.html');

const htmlFilePath = fs.existsSync(distHtmlPath) ? distHtmlPath : sourceHtmlPath;

console.log(`🔍 Checking for dist file: ${distHtmlPath} - ${fs.existsSync(distHtmlPath) ? 'EXISTS' : 'NOT FOUND'}`);
console.log(`🔍 Checking for source file: ${sourceHtmlPath} - ${fs.existsSync(sourceHtmlPath) ? 'EXISTS' : 'NOT FOUND'}`);
console.log(`📝 Using file: ${htmlFilePath}`);

if (fs.existsSync(htmlFilePath)) {
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Replace the placeholder with the actual connection string
  if (connectionString !== 'PLACEHOLDER_INSTRUMENTATION_KEY') {
    htmlContent = htmlContent.replace(
      'connectionString: "InstrumentationKey=PLACEHOLDER_INSTRUMENTATION_KEY;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus2.livediagnostics.monitor.azure.com/"',
      `connectionString: "${connectionString}"`
    );
    
    console.log(`✅ Application Insights connection string configured in ${htmlFilePath}`);
    console.log(`🔗 Connection string: ${connectionString.substring(0, 50)}...`);
  } else {
    console.log(`⚠️ Using placeholder connection string in ${htmlFilePath} - Application Insights not configured`);
  }
  
  fs.writeFileSync(htmlFilePath, htmlContent);
} else {
  console.error('❌ HTML file not found:', htmlFilePath);
}
