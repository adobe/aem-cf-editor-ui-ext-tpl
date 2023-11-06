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

const inquirer = require('inquirer');

const customField = (manifest) => {
  const inquirer2 = inquirer
    .prompt([
      {
        type: 'list',
        name: 'fieldType',
        message: 'Which field rendering do you want to change?',
        choices: [
          new inquirer.Separator(),
          {
            name: 'Based on a RegExp for "fragment content" path',
            value: 'pathExp',
          },
          {
            name: 'Based on a RegExp for "fragment content model" path',
            value: 'pathExp',
          },
          {
            name: 'Based on a RegExp for field type',
            value: 'pathExp',
          },
          {
            name: 'Based on a RegExp for field name',
            value: 'pathExp',
          },
        ],
      },
      regExpPrompt(),
    ])
    .then((answers) => {
      manifest.customFields = manifest.customFields || [];
    })
    .catch((error) => console.error(error));
  return inquirer2;
};

const regExpPrompt = (manifest, type) => {
  return {
    type: 'input',
    name: 'label',
    message: 'Please a RegExp:',
    validate: (value) => value.length ? true : 'Required.',
  };
};

module.exports = {
  customField,
};
