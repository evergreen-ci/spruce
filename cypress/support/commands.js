import { waitForGQL } from "../utils/networking";

const GQL_QUERY = "gqlQuery";
const LOGIN_COOKIE = "mci-token";

function enterLoginCredentials() {
  cy.get("input[name=username]").type("admin");
  cy.get("input[name=password]").type("password");
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("login", () => {
  cy.getCookie(LOGIN_COOKIE).then((c) => {
    if (!c) {
      cy.visit("/login");
      enterLoginCredentials();
    }
  });
});

Cypress.Commands.add("enterLoginCredentials", () => {
  enterLoginCredentials();
});

Cypress.Commands.add("preserveCookies", () => {
  Cypress.Cookies.preserveOnce(
    LOGIN_COOKIE,
    "mci-session",
    "mci-project-cookie"
  );
});

Cypress.Commands.add("listenGQL", () => {
  cy.server();
  cy.route("POST", "/graphql/query").as(GQL_QUERY);
});

Cypress.Commands.add("waitForGQL", (queryName, options = {}) =>
  waitForGQL(`@${GQL_QUERY}`, queryName, options)
);

Cypress.Commands.add("dataCy", (value) => cy.get(`[data-cy=${value}]`));
Cypress.Commands.add("dataRowKey", (value) =>
  cy.get(`[data-row-key=${value}]`)
);

Cypress.Commands.add("dataTestId", (value) =>
  cy.get(`[data-test-id=${value}]`)
);
