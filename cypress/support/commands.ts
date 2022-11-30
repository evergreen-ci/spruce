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

type cyGetOptions = Parameters<typeof cy.get>[1];

/* closeBanner */
Cypress.Commands.add("closeBanner", (dataCy: string) => {
  cy.dataCy(dataCy).within(() => cy.get("[aria-label='X Icon']").click());
});

/* dataCy */
Cypress.Commands.add("dataCy", (value: string, options: cyGetOptions = {}) => {
  cy.get(`[data-cy=${value}]`, options);
});

/* dataRowKey */
Cypress.Commands.add(
  "dataRowKey",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-row-key=${value}]`, options);
  }
);

/* dataTestId */
Cypress.Commands.add(
  "dataTestId",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-test-id=${value}]`, options);
  }
);

/* enterLoginCredentials */
function enterLoginCredentials() {
  cy.get("input[name=username]").type(user.username);
  cy.get("input[name=password]").type(user.password);
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("enterLoginCredentials", () => {
  enterLoginCredentials();
});

/* getInputByLabel */
Cypress.Commands.add("getInputByLabel", (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
});

/* login */
Cypress.Commands.add("login", () => {
  cy.getCookie(LOGIN_COOKIE).then((c) => {
    if (!c) {
      cy.request("POST", loginURL, { ...user });
    }
  });
});

/* preserveCookies */
Cypress.Commands.add("preserveCookies", () => {
  Cypress.Cookies.preserveOnce(
    LOGIN_COOKIE,
    "mci-session",
    "mci-project-cookie"
  );
});

/* toggleTableFilter */
Cypress.Commands.add("toggleTableFilter", (colNum: number) => {
  cy.get(`.ant-table-thead > tr > :nth-child(${colNum})`)
    .find("[role=button]")
    .first()
    .click();
  cy.get(":not(.ant-dropdown-hidden) > .ant-table-filter-dropdown").should(
    "be.visible"
  );
});

/* validateToast */
Cypress.Commands.add(
  "validateToast",
  (status: string, message: string = "", shouldClose: boolean = true) => {
    cy.dataCy(`toast`).should("be.visible");
    cy.dataCy("toast").should("have.attr", "data-variant", status);
    if (message) {
      cy.dataCy(`toast`).contains(message);
    }
    if (shouldClose) {
      cy.dataCy("toast").within(() => {
        cy.get("button[aria-label='Close Message']").click();
      });
      cy.dataCy("toast").should("not.exist");
    }
  }
);
