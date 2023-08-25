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


// Prevent '`fallbackFocus` as selector refers to no known node' errors.
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
