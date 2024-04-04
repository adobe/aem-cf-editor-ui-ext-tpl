const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

const metadataSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Generated schema for Root",
  type: "object",
  properties: {
    extensions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          extensionPoint: {
            type: "string",
          },
          url: {
            type: "string",
          },
        },
        required: ["extensionPoint"],
      },
    },
  },
  required: ["extensions"],
};

function transformConfigToMetadata(configJson) {
  const extensions = [];

  for (let [key, value] of Object.entries(configJson.extensions)) {
    extensions.push({
      extensionPoint: key,
      url: value?.operations?.view?.[0]?.impl,
    });
  }

  // Transform the data here
  const transformedData = {
    extensions,
  };
  return transformedData;
}

function validateSchema(metadataJson) {
  const validate = ajv.compile(metadataSchema);
  const valid = validate(metadataJson);
  if (!valid)
    throw new Error(
      "Metadata schema validation failed" +
        JSON.stringify(validate.errors, null, 4)
    );
}

function generateAppMetadata() {
  let outputMetadataJson = {};

  try {
    const appConfigYaml = fs.readFileSync(
      path.resolve(__dirname, "../app.config.yaml")
    );
    const appConfigJson = yaml.load(appConfigYaml, {});
    const result = transformConfigToMetadata(appConfigJson);
    validateSchema(result);

    //metadata is valid
    outputMetadataJson = result;
  } catch (message) {
    console.error(
      "Error transforming app.config.yaml to metadata. Metadata will not be available: ",
      message
    );
  }

  //write to file: valid metadata -or- empty object, incase validation fails
  fs.writeFileSync(
    "src/app-metadata.json",
    JSON.stringify(outputMetadataJson, null, 4)
  );
}

generateAppMetadata();
