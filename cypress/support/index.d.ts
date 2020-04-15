/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;
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
     * Custom command that asserts element existence based on value in xhr object
     * @param xhr request that determines element existence
     * @param resBodyPath path in xhr object containing information to base element existence
     * @param dataCyStr data-cy attribute for element
     * @param doesExist assert string for when element should exist
     * @param doesNotExist assert string for when element does not exist
     * @returns true if element exists and false otherwise
     *
     */
    elementExistenceCheck(
      xhr: Cypress.WaitXHR,
      resBodyPath: string,
      dataCyStr: string,
      doesExist?: string,
      doesNotExist?: string
    ): boolean;
  }
}

type truthyFunction = (v: any) => boolean;
interface WaitForGQLOptions {
  [index: string]: string | truthyFunction;
}
