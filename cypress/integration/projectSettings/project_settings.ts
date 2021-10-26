const settingsRoute = "project/evergreen/settings";
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

  it("Shows a navigation warning modal when clicking on a header link", () => {
    cy.get("a[href='/user/patches']").click();
    cy.dataCy("navigation-warning-modal").should("be.visible");
    cy.get("body").type("{esc}");
  });

  it("Does not show a navigation warning modal when navigating between settings tabs", () => {
    cy.dataCy("navitem-access").click();
    cy.dataCy("navigation-warning-modal").should("not.be.visible");
  });
});
