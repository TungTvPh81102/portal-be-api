// Register path aliases for runtime
const moduleAlias = require('module-alias');
const path = require('path');

// Register aliases
moduleAlias.addAliases({
  '@': path.resolve(__dirname, '../../dist/src')
});

// Export for potential use elsewhere
module.exports = {
  '@': path.resolve(__dirname, '../../dist/src')
};
