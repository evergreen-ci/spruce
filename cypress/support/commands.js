import { waitForGQL } from "../utils/networking";

const GQL_QUERY = "gqlQuery";
const LOGIN_COOKIE = "mci-token";
const TOAST_COOKIE = "announcement-toast";
const loginURL = "http://localhost:9090/login";
const user = {
  username: "admin",
  password: "password",
};
Cypress.Cookies.defaults({
  preserve: TOAST_COOKIE,
});

function enterLoginCredentials() {
  cy.get("input[name=username]").type(user.username);
  cy.get("input[name=password]").type(user.password);
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("login", () => {
  cy.getCookie(LOGIN_COOKIE).then((c) => {
    if (!c) {
      cy.request("POST", loginURL, { ...user });
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

Cypress.Commands.add("dataCy", (value, options) =>
  cy.get(`[data-cy=${value}]`, options)
);
Cypress.Commands.add("dataRowKey", (value, options) =>
  cy.get(`[data-row-key=${value}]`, options)
);

Cypress.Commands.add("dataTestId", (value, options) =>
  cy.get(`[data-test-id=${value}]`, options)
);

Cypress.Commands.add("getInputByLabel", (label) =>
  cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    })
);

Cypress.Commands.add("toggleTableFilter", (colNum) => {
  cy.get(`.ant-table-thead > tr > :nth-child(${colNum})`)
    .find("[role=button]")
    .first()
    .click();
  cy.wait(250); // wait for animation
});
