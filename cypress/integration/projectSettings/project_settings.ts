const getSettingsRoute = (identifier: string) =>
  `project/${identifier}/settings`;
const getGeneralRoute = (identifier: string) =>
  `${getSettingsRoute(identifier)}/general`;

const project = "spruce";
const projectUseRepoEnabled = "evergreen";
const repo = "602d70a2b2373672ee493184";

describe("Project Settings when not defaulting to repo", () => {
  const destination = getGeneralRoute(project);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Does not show a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo").should("not.exist");
  });

  it("Shows two radio boxes", () => {
    cy.dataCy("enabled-radio-box").children().should("have.length", 2);
  });
});

describe("Project Settings when defaulting to repo", () => {
  const destination = getGeneralRoute(projectUseRepoEnabled);

  before(() => {
    cy.login();
    cy.visit(destination);
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

  it("Shows a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo").should("exist");
  });

  it("Shows a third radio box when rendering a project that inherits from repo", () => {
    cy.dataCy("enabled-radio-box").children().should("have.length", 3);
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

describe("Repo Settings", () => {
  const destination = getGeneralRoute(repo);

  before(() => {
    cy.login();
    cy.visit(destination);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Does not show a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo").should("not.exist");
  });
});
