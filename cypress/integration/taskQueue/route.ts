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
      "/task-queue/osx-108/mongodb_cpp_driver_dev_osx_108_compile_and_test_671bda78e9947426e78bdae3ea13be1ce64ffe18_16_07_26_21_12_52"
    );

    cy.get(".ant-table-row-selected")
      .contains("13")
      .should("be.visible");
  });
});
