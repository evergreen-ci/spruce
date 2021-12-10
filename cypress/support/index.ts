// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// This code is included because a ResizeObserver error occurs when opening an antd dropdown.
// See the issue here: https://github.com/ant-design/ant-design/issues/26621
// The ResizeObserver error is ignored in cypress to allow the e2e tests to pass.
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-row-key attribute.
       * @example cy.dataRowKey('greeting')
       */
      dataRowKey(value: string): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-test-id attribute.
       * @example cy.dataTestId('greeting')
       */
      dataTestId(value: string): Chainable<Element>;
      /**
       * Custom command to preserve cookie between tests.
       * @example cy.preserveCookies()
       */
      preserveCookies(): void;
      /**
       * Custom command to navigate to login page and login.
       * @example cy.login()
       */
      login(): void;
      /**
       * Custom command to enter credentials in username and password input
       * and then click submit
       * @example cy.enterLoginCredentials()
       */
      enterLoginCredentials(): void;
      /**
       * Custom command to enter get an input by its label
       * @example cy.getInputBylabel("Some Label")
       */
      getInputByLabel(label: string): Chainable<Element>;
      /**
       * Custom command to open an antd table filter associated with the
       * the supplied column number
       *
       * @param columnNumber The order in which the target
       * column exists in the table starting at 1
       * @example cy.toggleTableFilter(1)
       */
      toggleTableFilter(columnNumber: number): void;

      /**
       * Custom command to paste a value into an input
       * Since this relies on a hack to paste a value on an input, it should be use sparingly
       * only in situations when users would normally expect to be able to paste a value into an input eg. ssh-keys
       * @param value The value to be pasted into the input
       * @param input The input element to be pasted into
       * @example cy.dataCy("some-input").paste("Some Value")
       */
      paste(value: string): void;
    }
  }
}
