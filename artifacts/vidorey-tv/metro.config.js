const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// React Compiler emits `import { c } from "react/compiler-runtime"`.
// Metro needs an explicit alias to resolve it to the installed package.
config.resolver = config.resolver ?? {};
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react/compiler-runtime': path.resolve(
    __dirname,
    'node_modules/react-compiler-runtime',
  ),
};

module.exports = config;
