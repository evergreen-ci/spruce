import { waitForGQL } from "../utils/networking";
import get from "lodash/get";

const GQL_QUERY = "gqlQuery";

function enterLoginCredentials() {
  cy.get("input[name=username]").type("admin");
  cy.get("input[name=password]").type("password");
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("login", () => {
  cy.visit("/login");
  enterLoginCredentials();
});

Cypress.Commands.add("enterLoginCredentials", () => {
  enterLoginCredentials();
});

Cypress.Commands.add("preserveCookies", () => {
  Cypress.Cookies.preserveOnce(
    "mci-token",
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

Cypress.Commands.add(
  "elementExistenceCheck",
  (
    xhr,
    resBodyPath,
    dataCyStr,
    doesExist = "not.be.empty",
    doesNotExist = "be.empty"
  ) => {
    const el = cy.dataCy(dataCyStr);
    if (get(xhr, resBodyPath)) {
      el.should(doesExist);
      return true;
    }
    el.should(doesNotExist);
    return false;
  }
);
