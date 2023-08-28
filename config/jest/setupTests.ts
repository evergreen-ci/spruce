// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import MutationObserver from "mutation-observer";

// @ts-ignore
global.MutationObserver = MutationObserver;

// @ts-ignore
window.crypto.randomUUID = (() => {
  let value = 0;
  return () => {
    value += 1;
    return value.toString();
  };
})();

// Mock focus-trap-react to prevent errors in tests that use modals. focus-trap-react is a package used
// by LeafyGreen and is not a direct dependency of this repo.
jest.mock(
  "focus-trap-react",
  () => {
    const focusTrap = jest.requireActual(
      "focus-trap-react"
    );
    focusTrap.prototype.setupFocusTrap = () => null;
    return focusTrap;
  }
);
