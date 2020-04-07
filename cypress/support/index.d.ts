// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;
    waitForGQL(queryName: string, options?: WaitForGQLOptions);
    preserveCookies(): void;
    login(): void;
    listenGQL(): void;
    enterCredentials(): void;
  }
}

type truthyFunction = (v: any) => boolean;
interface WaitForGQLOptions {
  [index: string]: string | truthyFunction;
}
