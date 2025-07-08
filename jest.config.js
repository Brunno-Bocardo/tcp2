const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  roots: ["<rootDir>/backend"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};