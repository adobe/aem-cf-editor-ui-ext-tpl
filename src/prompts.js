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

const inquirer = require('inquirer')
const slugify = require('slugify')
const chalk = require('chalk')
const path = require('path')
const { readManifest } = require('./utils')
const headerMenuButtonPrompts = require('./prompts/header-menu')
const { toolbarButtonPrompts, badgePrompts, widgetPrompts } = require('./prompts/rte')

const DEMO_MANIFEST_PATH = path.join(__dirname, './manifests/demo-extension-manifest.json')

var exitMenu = false

const briefOverviews = {
  templateInfo: `\nAEM Content Fragment Editor Template Overview:\n
  * You have the option to generate boilerplate code for your extension.
  * You can get help regarding documentation at any time from the menu.
  * You can check out a sample demo project.
  * An App Builder project will be created with Node.js packages pre-configured.\n`
}

const promptDocs = {
  mainDoc: "https://developer.adobe.com/uix/docs/",
  demoExtensionDoc: "https://developer.adobe.com/uix/docs/"
}

// Top Level prompts
const promptTopLevelFields = (manifest) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: "What do you want to name your extension?",
      validate(answer) {
        if (!answer.length) {
          return 'Required.'
        }

        return true
      }
    },
    {
      type: 'input',
      name: 'description',
      message: "Please provide a short description of your extension:",
      validate(answer) {
        if (!answer.length) {
          return 'Required.'
        }

        return true
      }
    },
    {
      type: 'input',
      name: 'version',
      message: "What version would you like to start with?",
      default: '0.0.1',
      validate(answer) {
        if (!new RegExp("^\\bv?(?:0|[1-9][0-9]*)(?:\\.(?:0|[1-9][0-9]*)){2}(?:-[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?\\b$").test(answer)) {
          return 'Required. Must match semantic versioning rules.'
        }

        return true
      }
    }
  ])
  .then((answers) => {
    if (answers.name) {
      manifest.name = answers.name
      manifest.id = slugify(answers.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,       // convert to lower case, defaults to `false`
        strict: true,      // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })
    }

    if (answers.description) {
      manifest.description = answers.description
    }

    if (answers.version) {
      manifest.version = answers.version
    }
  })
}

// Main Menu prompts
const promptMainMenu = (manifest) => {
  const choices = []

  choices.push(
    new inquirer.Separator(),
    {
      name: "Add a custom button to Header Menu",
      value: headerMenuButtonPrompts.bind(this, manifest),
    },
    {
      name: "Add Rich Text Editor (RTE) Toolbar Button",
      value: toolbarButtonPrompts.bind(this, manifest),
    },
    {
      name: "Add Rich Text Editor (RTE) Toolbar Widget",
      value: widgetPrompts.bind(this, manifest),
    },
    {
      name: "Add Rich Text Editor (RTE) Toolbar Badge",
      value: badgePrompts.bind(this, manifest),
    },
    new inquirer.Separator(),
    {
      name: "I'm done",
      value: () => {
        return Promise.resolve(true)
      }
    },
    {
      name: "I don't know",
      value: promptGuideMenu.bind(this, manifest)
    }
  )

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: "What would you like to do next?",
      choices,
    })
    .then((answers) => answers.execute())
    .then((endMainMenu) => {
      if (!endMainMenu && !exitMenu) {
        return promptMainMenu(manifest)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// Guide Menu Prompts
const promptGuideMenu = (manifest) => {
  const choices = []

  choices.push(
    new inquirer.Separator(),
    {
      name: "Try a demo project based on React (ChatGPT support for Rich Text Editor)",
      value: () => {
        const demoManifest = readManifest(DEMO_MANIFEST_PATH)

        // Update the extension manifest object
        manifest['name'] = demoManifest['name'] || null
        manifest['id'] = demoManifest['id'] || null
        manifest['description'] = demoManifest['description'] || null
        manifest['version'] = demoManifest['version'] || null
        manifest['templateFolder'] = demoManifest['templateFolder'] || null
        manifest['templateDotEnvVars'] = demoManifest['templateDotEnvVars'] || null
        manifest['isDemoExtension'] = demoManifest['isDemoExtension'] || false
        exitMenu = true

        return Promise.resolve(true)
      }
    },
    {
      name: "Find some help",
      value: helpPrompts.bind(this)
    },
    new inquirer.Separator(),
    {
      name: "Go back",
      value: () => {
        return Promise.resolve(true)
      }
    }
  )

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: "What about this then?",
      choices,
    })
    .then((answers) => answers.execute())
    .then((endGuideMenu) => {
      if (!endGuideMenu) {
        return promptGuideMenu(manifest)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// Helper prompts for Guide Menu
const helpPrompts = () => {
  console.log('  Please refer to:')
  console.log(chalk.blue(chalk.bold(`  -> ${promptDocs['mainDoc']}`)) + '\n')
}

module.exports = {
  briefOverviews,
  promptTopLevelFields,
  promptMainMenu,
  promptDocs
}
