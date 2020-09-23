describe("Task Queue", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Sets first distro in list as default if no distro in url", () => {
    cy.visit("/task-queue");

    cy.location("pathname").should("eq", "/task-queue/osx-108");

    cy.dataCy("select-distro").contains("osx-108");
  });

  it("Uses distro param in url to query queue and renders table", () => {
    cy.visit("/task-queue/osx-108");

    cy.get(".ant-table-row").should("have.length", 13);

    cy.visit("/task-queue/debian71-test");

    cy.get(".ant-table-row").should("have.length", 0);
  });

  it("Selecting a distro queries the queue for that distro", () => {
    cy.visit("/task-queue/debian71-test");

    cy.get(".ant-table-row").should("have.length", 0);

    cy.dataCy("select-distro").click();

    cy.dataCy("osx-108-distro-option").click();

    cy.get(".ant-table-row").should("have.length", 13);
  });

  it("Searching for a distro shows results that match search term", () => {
    cy.visit("/task-queue");

    cy.dataCy("select-distro").type("deb");

    cy.get(".ant-select-item-option-content")
      .should("have.length", 1)
      .and("contain.text", "debian71-test");
  });

  it("Bogus distro url param values shows an empty list", () => {
    cy.visit("/task-queue/peace");

    cy.get(".ant-table-row").should("have.length", 0);
  });

  it("Scrolls to current task if taskId param in url", () => {
    cy.visit(
      "/task-queue/osx-108/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );

    cy.get(".ant-table-row-selected")
      .contains("13")
      .should("be.visible");
  });

  it("Task links goes to Spruce for patches and legacy UI for mainline commits", () => {
    cy.visit(
      "/task-queue/osx-108/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48"
    );

    // patch
    cy.dataCy("current-task-link")
      .eq(0)
      .should("have.attr", "href")
      .and("not.contain", "localhost");

    // mainline commit
    cy.dataCy("current-task-link")
      .eq(1)
      .should("have.attr", "href")
      .and("contain", "localhost");
  });
});
