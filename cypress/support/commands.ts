const LOGIN_COOKIE = "mci-token";
const TOAST_COOKIE = "announcement-toast";
const APRIL_FOOLS = "april-fools-cookie";
const loginURL = "http://localhost:9090/login";
const user = {
  username: "admin",
  password: "password",
};
Cypress.Cookies.defaults({
  preserve: [TOAST_COOKIE, APRIL_FOOLS],
});

function enterLoginCredentials() {
  cy.get("input[name=username]").type(user.username);
  cy.get("input[name=password]").type(user.password);
  cy.get("button[id=login-submit]").click();
}

Cypress.Commands.add("login", () => {
  cy.setCookie(APRIL_FOOLS, "false");
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

type cyGetOptions = Parameters<typeof cy.get>[1];
Cypress.Commands.add("dataCy", (value: string, options: cyGetOptions) =>
  cy.get(`[data-cy=${value}]`, options)
);
Cypress.Commands.add("dataRowKey", (value: string, options: cyGetOptions) =>
  cy.get(`[data-row-key=${value}]`, options)
);

Cypress.Commands.add("dataTestId", (value: string, options: cyGetOptions) =>
  cy.get(`[data-test-id=${value}]`, options)
);

Cypress.Commands.add("getInputByLabel", (label: string) =>
  cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    })
);

Cypress.Commands.add("toggleTableFilter", (colNum: number) => {
  cy.get(`.ant-table-thead > tr > :nth-child(${colNum})`)
    .find("[role=button]")
    .first()
    .click();
  cy.get(".ant-table-filter-dropdown").should("be.visible");
});

Cypress.Commands.add(
  "paste",
  { prevSubject: true },
  (selector: Element, pastePayload: string) => {
    // We can paste directly into a textarea but the onchange event is not fired because cypress directly manipulates the dom elements value.
    // So we need to manually type in the last character of the paste payload to trigger an onchange event.
    const subString = pastePayload.substr(0, pastePayload.length - 1);
    const lastChar = pastePayload.slice(-1);
    cy.wrap(selector).invoke("val", subString);
    cy.wrap(selector).type(lastChar);
  }
);

Cypress.Commands.add("validateToast", (status: string, message?: string) => {
  cy.dataCy(`toast`).should("be.visible");
  cy.dataCy("toast").should("have.attr", "data-variant", status);
  if (message) {
    cy.dataCy(`toast`).contains(message);
  }
});
