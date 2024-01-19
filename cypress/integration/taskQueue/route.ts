describe("Task Queue", () => {
  it("Sets first distro in list as default if no distro in url", () => {
    cy.visit("/task-queue");

    cy.location("pathname").should("eq", "/task-queue/osx-108");

    cy.contains("osx-108").should("exist");
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

    cy.dataCy("distro-dropdown").click();

    cy.get("div").contains("osx-108").click();

    cy.get(".ant-table-row").should("have.length", 13);
  });

  it("Renders link to host page filtered to that particular distro", () => {
    cy.visit("/task-queue/debian71-test");
    cy.contains("View hosts")
      .should("have.attr", "href")
      .and("eq", "/hosts?distroId=debian71-test");
  });

  it("Searching for a distro shows results that match search term", () => {
    cy.visit("/task-queue/debian71-test");

    cy.dataCy("distro-dropdown").click();
    cy.dataCy("distro-dropdown-search-input").type("osx");
    cy.dataCy("distro-dropdown-options").within(() => {
      cy.contains("debian71-test").should("not.exist");
      cy.contains("osx-108").should("exist");
    });
  });

  it("Bogus distro url param values do not display any results", () => {
    cy.visit("/task-queue/peace");
    cy.get(".ant-table-row").should("have.length", 0);
  });

  it("Scrolls to current task if taskId param in url", () => {
    cy.visit(
      "/task-queue/osx-108/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
    cy.dataCy("task-queue-table").should("exist");
    cy.get(".ant-table-row-selected").should("exist");
    cy.get(".ant-table-row-selected").should("contain.text", "13");

    cy.contains("osx-108").should("not.be.visible");
    cy.get(".ant-table-row-selected").should("be.visible");
  });

  it("Task links goes to Spruce for both patches and mainline commits", () => {
    cy.visit(
      "/task-queue/osx-108/evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
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
      .and("not.contain", "localhost");
  });
});
