// Mock focus-trap-react to prevent errors in tests that use modals. focus-trap-react is a package used
// by LeafyGreen and is not a direct dependency of Spruce.
const lib = jest.requireActual("focus-trap-react");

lib.prototype.setupFocusTrap = () => null;

module.exports = lib;
