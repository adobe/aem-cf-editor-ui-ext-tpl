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
const slugify = require('slugify');

const toolbarButtonPrompts = (manifest) => {
  const idMessage = "Please provide ID for the toolbar button (must be unique across all extensions, consider"
      + " adding a vendor prefix to this field):";
  const tooltipMessage = "Please provide tooltip for the button (a text that will be rendered on mouse over):";

  return inquirer
    .prompt([idPrompt(idMessage), tooltipPrompt(tooltipMessage)])
    .then((answers) => {
      manifest["rte"] = manifest["rte"] || {};
      manifest["rte"]["toolbarButtons"] = manifest["rte"]["toolbarButtons"] || [];
      manifest["rte"]["toolbarButtons"].push(answers);
    })
    .catch((error) => console.error(error));
};

const widgetPrompts = (manifest) => {
  const labelMessage = "Please provide label name for the widget:";

  return inquirer
    .prompt([labelPrompt(labelMessage)])
    .then((answers) => {
      answers.id = formatId(answers.label);

      manifest["rte"] = manifest["rte"] || {};
      manifest["rte"]["widgets"] = manifest["rte"]["widgets"] || [];
      manifest["rte"]["widgets"].push(answers);
    })
    .catch((error) => console.error(error));
};

const badgePrompts = (manifest) => {
  const idMessage = "Please provide ID for the badge (must be unique across all extensions, consider adding a vendor"
    + " prefix to this field):";

  return inquirer
    .prompt([idPrompt(idMessage)])
    .then((answers) => {
      manifest["rte"] = manifest["rte"] || {};
      manifest["rte"]["badges"] = manifest["rte"]["badges"] || [];
      manifest["rte"]["badges"].push(answers);
    })
    .catch((error) => console.error(error));
};

const idPrompt = (message) => {
  return {
    type: 'input',
    name: 'id',
    message: message,
    validate: (answer) => answer.length ? true : 'Required.',
    transformer: (answer) => formatId(answer),
  };
};

const tooltipPrompt = (message) => {
  return {
    type: 'input',
    name: 'tooltip',
    message: message,
    validate: (answer) => answer.length ? true : 'Required.',
  };
};

const labelPrompt = (message) => {
  return {
    type: 'input',
    name: 'label',
    message: message,
    validate: (answer) => answer.length ? true : 'Required.',
  };
};

const formatId = (id) => {
  return slugify(id.replace(/^\d+/, ''), {
    lower: true,
    strict: true,
  });
};

module.exports = {
  toolbarButtonPrompts,
  badgePrompts,
  widgetPrompts,
};
