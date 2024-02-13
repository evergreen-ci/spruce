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
import {
  CY_DISABLE_COMMITS_WELCOME_MODAL,
  CY_DISABLE_NEW_USER_WELCOME_MODAL,
  SLACK_NOTIFICATION_BANNER,
} from "constants/cookies";
import { isMutation } from "../utils/graphql-test-utils";
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
       * Close a dismissible LeafyGreen banner with the given data-cy property.
       * @example cy.closeBanner("slack-notification")
       */
      closeBanner(dataCy: string): void;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-row-key attribute.
       * @example cy.dataRowKey('greeting')
       */
      dataRowKey(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-test-id attribute.
       * @example cy.dataTestId('greeting')
       */
      dataTestId(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
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
      getInputByLabel(label: string | RegExp): Chainable<Element>;
      /**
       * Custom command to select an option from a leafygreen select component by label
       * @param label The label of the select component
       * @param option The option text to select
       * @example cy.selectLGOption("Some Label", "Some Option")
       */
      selectLGOption(label: string, option: string | RegExp): void;
      /**
       * Custom command to navigate to login page and login.
       * @example cy.login()
       */
      login({ isAdmin }: { isAdmin: boolean }): void;
      /**
       * Custom command to log out of the application.
       * @example cy.logout()
       */
      logout(): void;
      /**
       * Custom command to open an antd table filter associated with the
       * the supplied column number
       * @param columnNumber - The order in which the target column exists in the table starting at 1
       * @example cy.toggleTableFilter(1)
       */
      toggleTableFilter(columnNumber: number): void;
      /**
       * Custom command to validate a toast was rendered
       * @example cy.validateToast("success", "This succeeded")
       * @example cy.validateToast("error", "This failed")
       * @example cy.validateToast("warning", "This is a warning")
       * @example cy.validateToast("info", "This is an info message")
       * @example cy.validateToast("success")
       */
      validateToast(
        type: "success" | "warning" | "error" | "info",
        message?: string,
        shouldClose?: boolean,
      ): void;
      /**
       * Custom command to overwrite a GQL response
       * @param operationName - The operation name of the query
       * @param body - The replacement response body
       */
      overwriteGQL(operationName: string, body: any);
      /**
       * Command to open expandable card
       * @param cardTitle - The title of the card to expand
       */
      openExpandableCard(cardTitle: string);
      /**
       * Command to validate sort is applied to table
       * @param direction - The direction of the sort that should be applied
       */
      validateTableSort(direction: "asc" | "desc" | "none");
    }
  }
}

before(() => {
  cy.exec("yarn evg-db-ops --restore").then((result) => {
    if (result.code !== 0) {
      throw new Error("EVG DB restoration failed during setup.");
    }
  });
});

// Close over beforeEach and afterEach to encapsulate mutationDispatched
(() => {
  let mutationDispatched: boolean;
  beforeEach(() => {
    cy.login({ isAdmin: true });
    cy.setCookie(bannerCookie, "true");
    cy.setCookie(CY_DISABLE_COMMITS_WELCOME_MODAL, "true");
    cy.setCookie(CY_DISABLE_NEW_USER_WELCOME_MODAL, "true");
    cy.setCookie(SLACK_NOTIFICATION_BANNER, "true");
    mutationDispatched = false;
    cy.intercept("POST", "/graphql/query", (req) => {
      if (isMutation(req)) {
        mutationDispatched = true;
      }
    });
  });

  afterEach(() => {
    if (mutationDispatched) {
      cy.log("A mutation was detected. Restoring EVG.");
      cy.exec("yarn evg-db-ops --restore");
    }
  });
})();

const bannerCookie = "This is an important notification";
