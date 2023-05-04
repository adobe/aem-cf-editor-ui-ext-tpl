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
  "rte": {
    "badges": [
      {
        "id": "badge-1",
      },
      {
        "id": "badge-2",
      },
    ],
    "toolbarButtons": [
      {
        "id": "tb-button-1",
        "tooltip": "tb-button-1-tooltip",
      },
    ],
    "widgets": [
      {
        "label": "widget-1",
        "id": "widget-1-label",
      },
      {
        "label": "widget-2",
        "id": "widget-2-label",
      },
    ],
  },
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