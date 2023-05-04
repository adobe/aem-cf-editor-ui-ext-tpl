const defaultExtensionManifest = {
  "name": "CF Editor Test Extension",
  "id": "cf-editor-test-extension",
  "description": "Test Extension for AEM Content Fragment Editor",
  "version": "0.0.1",
};

const customExtensionManifest = {
  "name": "CF Editor Test Extension",
  "id": "cf-editor-test-extension",
  "description": "Test Extension for AEM Content Fragment Editor",
  "version": "0.0.1",
  "headerMenuButtons": [
    {
      "label": "Import",
      "needsModal": true,
      "id": "import",
    }
  ],
};

const demoExtensionManifest = {
  "name": "ChatGPT rich text editor sample extension",
  "id": "chatgpt-editor-extension-demo",
  "description": "This extensions adds ChatGPT support to rich text editor in CF Editor",
  "version": "1.0.0",
  "isDemoExtension": true,
  "templateDotEnvVars": ["OPENAI_API_KEY", "OPENAI_ORG"],
};

module.exports = {
  defaultExtensionManifest,
  customExtensionManifest,
  demoExtensionManifest,
};