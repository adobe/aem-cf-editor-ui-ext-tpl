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

const path = require('path');
const Generator = require('yeoman-generator');

class WebAssetsReactGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts);

    this.option("extensionOptions", { type: Object });

    this.templatesFolder = path.resolve(path.join(__dirname, '../templates/'));
    // templateProps are used in ejs templates
    this.templateProps = {
      extensionManifest: this.options.extensionOptions.manifest,
      demoExtensionTemplatesFolder: this.options.extensionOptions.demoExtensionTemplatesFolder,
    };
  }

  writing () {
    this.copyStaticFiles();
    this.generateAppRoute();
    this.generateExtensionRegistration();
    this.generateModalFiles('headerMenu')
    this.configureBabel();
  }

  copyStaticFiles() {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/web/**/*`),
      this.destinationPath(this.options.extensionOptions.webSrcFolder),
      this.templateProps
    );
  }

  generateAppRoute() {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/app.ejs`),
      this.destinationPath(`${this.options.extensionOptions.webSrcFolder}/src/components/App.js`),
      this.templateProps
    )
  }

  generateExtensionRegistration() {
    this.fs.copyTpl(
      this.templatePath(`${this.templatesFolder}/extension-registration.ejs`),
      this.destinationPath(
        `${this.options.extensionOptions.webSrcFolder}/src/components/ExtensionRegistration.js`
      ),
      this.templateProps
    )
  }

  generateModalFiles(extensionArea) {
    const customButtons = this.options.extensionOptions.manifest.headerMenuButtons || [];

    customButtons.forEach((button) => {
      if (button.needsModal) {
        const modalFileName = button.label.replace(/ /g, '') + 'Modal';
        this.fs.copyTpl(
          this.templatePath(`${this.templatesFolder}/modal.ejs`),
          this.destinationPath(`${this.options.extensionOptions.webSrcFolder}/src/components/${modalFileName}.js`),
          {
            ...this.templateProps,
            functionName: modalFileName,
            extensionArea: extensionArea,
          }
        );
      }
    });
  }

  configureBabel() {
    // NOTE this is a global file and might conflict
    this.fs.writeJSON(this.destinationPath('.babelrc'), {
      plugins: ['@babel/plugin-transform-react-jsx']
    })
  }
}

module.exports = WebAssetsReactGenerator;
