/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Generator = require('yeoman-generator');
const { utils } = require('@adobe/generator-app-common-lib');
const path = require('path');

/**
 * Generate some additional things related only to demo extension
 */
class DemoExtensionGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.option('extensionOptions', { type: Object });
  }

  writing () {
    this.addDependencies();
    this.copyReadme();
  }

  addDependencies () {
    utils.addDependencies(this, {
      openai: '^3.1.0',
    });
  }

  copyReadme () {
    this.fs.copyTpl(
      this.templatePath(
        path.resolve(__dirname, '..', 'templates', this.options.extensionOptions.demoExtensionTemplatesFolder, 'README.md.ejs')
      ),
      this.destinationPath('README.md'),
      {
        extensionManifest: this.options.extensionOptions.manifest,
      }
    );
  }
}

module.exports = DemoExtensionGenerator;
