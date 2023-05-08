const defaultExtensionManifest = {
  name: 'CF Editor Test Extension',
  id: 'cf-editor-test-extension',
  description: 'Test Extension for AEM Content Fragment Editor',
  version: '0.0.1',
};

const customExtensionManifest = {
  name: 'CF Editor Test Extension',
  id: 'cf-editor-test-extension',
  description: 'Test Extension for AEM Content Fragment Editor',
  version: '1.0.1',
  headerMenuButtons: [
    {
      label: 'Import',
      needsModal: true,
      id: 'import',
    },
    {
      label: 'Export',
      needsModal: false,
      id: 'export',
    },
  ],
  rte: {
    badges: [
      {
        id: 'badge-1',
      },
      {
        id: 'badge2',
      },
    ],
    toolbarButtons: [
      {
        id: 'tb-button-1',
        tooltip: 'tb button 1 tooltip',
      },
    ],
    widgets: [
      {
        label: 'Widget-1',
        id: 'widget-1',
      },
      {
        label: 'Widget-2',
        id: 'widget2',
      },
    ],
  },
};

const demoExtensionManifest = {
  name: 'ChatGPT rich text editor sample extension',
  id: 'chatgpt-editor-extension-demo',
  description: 'This extensions adds ChatGPT support to rich text editor in CF Editor',
  version: '1.0.0',
  isDemoExtension: true,
  templateDotEnvVars: ['OPENAI_API_KEY', 'OPENAI_ORG'],
};

module.exports = {
  defaultExtensionManifest,
  customExtensionManifest,
  demoExtensionManifest,
};
