const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Zustand v4.5+ ESM builds use `import.meta.env.MODE` which is a SyntaxError
// in Metro's non-module script output for web. Redirect all zustand imports
// on web to the CJS builds via absolute paths (bypassing the package exports map).
const zustandRoot = path.join(__dirname, 'node_modules/zustand');
const zustandCjsMap = {
  'zustand': 'index.js',
  'zustand/vanilla': 'vanilla.js',
  'zustand/middleware': 'middleware.js',
  'zustand/middleware/immer': path.join('middleware', 'immer.js'),
  'zustand/react': 'react.js',
  'zustand/shallow': 'shallow.js',
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && zustandCjsMap[moduleName] !== undefined) {
    return {
      filePath: path.join(zustandRoot, zustandCjsMap[moduleName]),
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
