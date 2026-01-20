// Register path aliases for runtime
const moduleAlias = require('module-alias');
const path = require('path');

// Register aliases
// When this file is in dist/src/config, __dirname is /path/to/dist/src/config
// So we need to go up two levels to get to the dist directory
moduleAlias.addAliases({
  '@': path.resolve(__dirname, '../..')
});

// Export for potential use elsewhere
module.exports = {
  '@': path.resolve(__dirname, '../..')
};
