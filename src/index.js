/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License")
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Generator = require('yeoman-generator');
const path = require('path');
const chalk = require('chalk');
const { utils } = require('@adobe/generator-app-common-lib');
const { readManifest, writeManifest } = require('./utils');
const { briefOverviews, promptTopLevelFields, promptMainMenu, promptDocs } = require('./prompts');

const ConfigGenerator = require('./generators/config');
const DependenciesGenerator = require('./generators/dependencies');
const WebAssetsReactGenerator = require('./generators/web-assets-react');
// generate some additional things related only to demo extension
const DemoExtensionGenerator = require('./generators/demo-extension');

const EXTENSION_MANIFEST_PATH = path.join(process.cwd(), 'extension-manifest.json');
// Don't put it in the manifest to avoid binding the generation "result" to the knowledge of "how it was generated"
const DEMO_EXTENSION_TEMPLATES_FOLDER = 'chatgpt-demo';

/**
 * Possible hooks:
 *
 * initializing
 * prompting
 * configuring
 * default
 * writing
 * conflicts
 * install
 * end
 *
 */
class MainGenerator extends Generator {
  extensionOptions = {};

  constructor (args, opts) {
    super(args, opts);

    this.option('skip-prompt', { default: false });
    this.option('skip-install', { default: true });
    this.option('extension-manifest', { type: Object, default: undefined });
  }

  initializing () {
    const extensionRootFolder = 'src/aem-cf-editor-1';
    this.extensionOptions = {
      type: 'aem/cf-editor/1',
      rootFolder: extensionRootFolder,
      webSrcFolder: `${extensionRootFolder}/web-src`,
      configPath: `${extensionRootFolder}/ext.config.yaml`,
      manifest: this.options['extension-manifest']
        ? this.options['extension-manifest']
        : readManifest(EXTENSION_MANIFEST_PATH),
      demoExtensionTemplatesFolder: DEMO_EXTENSION_TEMPLATES_FOLDER,
    };
  }

  async prompting () {
    if (this.options['skip-prompt']) {
      return;
    }
    this.log(briefOverviews.templateInfo);

    await promptTopLevelFields(this.extensionOptions.manifest)
      .then(() => promptMainMenu(this.extensionOptions.manifest))
      .then(() => writeManifest(this.extensionOptions.manifest, EXTENSION_MANIFEST_PATH))
      .then(() => {
        this.log('\nExtension Manifest for Code Pre-generation');
        this.log('------------------------------------------');
        this.log(JSON.stringify(this.extensionOptions.manifest, null, '  '));
      });
  }

  async writing () {
    this.composeWith(
      {
        Generator: WebAssetsReactGenerator,
        path: 'unknown',
      },
      {
        extensionOptions: this.extensionOptions,
      }
    );

    this.composeWith(
      {
        Generator: DependenciesGenerator,
        path: 'unknown',
      },
      {
        extensionOptions: this.extensionOptions,
      }
    );

    this.composeWith(
      {
        Generator: ConfigGenerator,
        path: 'unknown',
      },
      {
        extensionOptions: this.extensionOptions,
      }
    );

    if (this.extensionOptions.manifest.isDemoExtension) {
      // generate some additional things related only to demo extension
      this.composeWith(
        {
          Generator: DemoExtensionGenerator,
          path: 'unknown',
        },
        {
          extensionOptions: this.extensionOptions,
        }
      );
    }
  }

  async conflicts () {
    const content = utils.readPackageJson(this);
    content.description = this.extensionOptions.manifest.description;
    content.version = this.extensionOptions.manifest.version;
    utils.writePackageJson(this, content);
  }

  async end () {
    this.log(chalk.bold('\nSample code files have been generated.\n'));
    this.log(chalk.bold('Next Steps:'));
    this.log(chalk.bold('-----------'));
    this.log(chalk.bold('1) Populate your local environment variables in the ".env" file.'));
    this.log(chalk.bold('2) You can use `aio app run` or `aio app deploy` to see the sample code files in action.'));

    if (this.extensionOptions.manifest.isDemoExtension) {
      this.log(chalk.bold('3) Please refer to the link below for configuring the demo application:'));
      this.log(chalk.blue(chalk.bold(`   -> ${promptDocs.demoExtensionDoc}`)));
    }
    this.log('\n');
  }
}

module.exports = MainGenerator;
