// / <reference types="cypress" />

declare namespace Cypress {
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
     * Custom command to wait for a gqlQuery with queryName.
     * @param queryName Name of the query to wait for
     * @param options Key is the path in WaitXHR object. Value
     * is a function that accepts WaitXHR value at key path and returns a boolean
     * to indicate a match or is a string value that is matched
     * with WaitXHR at the key path
     * @example cy.dataCy("taskTests", {"path.to.value": "value-to-match"})
     * @example cy.dataCy("taskTests", {"path.to.value": (value) => value && value.length > 2})
     */
    waitForGQL(
      queryName: string,
      options?: WaitForGQLOptions
    ): Chainable<WaitXHR>;
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
     * Custom command to listen to GQL requests. Call this before
     * your tests to use cy.waitForGQL
     * @example cy.listenGQL()
     */
    listenGQL(): void;
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
  }
}

type truthyFunction = (v: any) => boolean;
interface WaitForGQLOptions {
  [index: string]: string | truthyFunction;
}
