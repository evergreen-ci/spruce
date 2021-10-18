const settingsRoute = `project/evergreen/settings`;
const generalRoute = `${settingsRoute}/general`;

describe("Project Settings", () => {
  before(() => {
    cy.login();
    cy.visit(generalRoute);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Preserves edits to the form when navigating between settings tabs", () => {
    cy.dataCy("spawn-host-input").should("have.value", "/path");
    cy.dataCy("spawn-host-input").type("/test");
    cy.dataCy("navitem-access").click();
    cy.dataCy("navitem-general").click();
    cy.dataCy("spawn-host-input").should("have.value", "/path/test");
  });
});
