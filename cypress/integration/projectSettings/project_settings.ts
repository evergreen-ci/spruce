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

  it("Visiting the access page should not have the save button enabled", () => {
    cy.dataCy("navitem-access").click();
    cy.dataCy("save-settings-button").should("be.disabled");
  });

  it("Does not enable the save button when adding a new array element", () => {
    cy.dataCy("add-button").click();
    cy.dataCy("save-settings-button").should("be.disabled");
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

  it("Loads with the save button disabled initially", () => {
    cy.dataCy("save-settings-button").should("be.disabled");
  });

  it("Preserves edits to the form when navigating between settings tabs and does not show a warning modal", () => {
    cy.dataCy("spawn-host-input").should("have.value", "/path");
    cy.dataCy("spawn-host-input").type("/test");
    cy.dataCy("navitem-access").click();
    cy.dataCy("navigation-warning-modal").should("not.be.visible");
    cy.dataCy("navitem-general").click();
    cy.dataCy("spawn-host-input").should("have.value", "/path/test");
  });

  it("Enables the save button", () => {
    cy.dataCy("save-settings-button").should("not.be.disabled");
  });

  it("Shows a 'Default to Repo' button on page", () => {
    cy.dataCy("default-to-repo").should("exist");
  });

  it("Shows a third radio box when rendering a project that inherits from repo", () => {
    cy.dataCy("enabled-radio-box").children().should("have.length", 3);
  });

  it("Does not default to repo value for display name", () => {
    cy.dataCy("display-name-input").should("not.have.attr", "placeholder");
  });

  it("Shows a navigation warning modal when clicking on a header link", () => {
    cy.get("a[href='/user/patches']").click();
    cy.dataCy("navigation-warning-modal").should("be.visible");
    cy.get("body").type("{esc}");
  });

  it("Clicking on save button should show a success toast", () => {
    cy.dataCy("save-settings-button").click();
    cy.contains("Successfully updated project");
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

  it("Does not show a 'Move to New Repo' button on page", () => {
    cy.dataCy("move-repo-button").should("not.exist");
  });

  it("Sets a display name", () => {
    cy.dataCy("display-name-input").type("evg");
  });

  it("Clicking on save button should show a success toast", () => {
    cy.dataCy("save-settings-button").click();
    cy.contains("Successfully updated repo");
  });
});
