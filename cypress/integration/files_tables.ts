// / <reference types="Cypress" />
// / <reference path="../support/index.d.ts" />

const waitForFilesQuery = () => cy.waitForGQL("TaskFiles");
const FILES_ROUTE = "/task/evergreen_ubuntu1604_89/files";
const FILES_ROUTE_WITHOUT_FILES =
  "/task/evergreen_ubuntu1604_test_model_commitqueue_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/files ";

describe("files table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Should not render table when invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/files");
    cy.waitForGQL("GetTask");
    cy.get(".ant-table").should("not.exist");
  });

  it("File names under name column should have target=_blank attribute", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".fileLink").should("have.attr", "target", "_blank");
  });

  it("Searching for Hello world yields 0 results, tables will not render and will display 'No files found'", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".ant-input").type("Hello world");
    cy.wait(350); // wait because input has debounce
    cy.get(".ant-table").should("not.exist");
    cy.get(".fileLink").should("not.exist");
    cy.contains("No files found");
  });

  it("Searching for 458 yields 4 results across 4 tables", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".ant-input").type("458");
    cy.wait(350); // wait because input has debounce
    cy.get(".fileLink").should("have.length", 4);
  });

  it("Should display 'No files found' after loading a task without files", () => {
    cy.visit(FILES_ROUTE_WITHOUT_FILES);
    waitForFilesQuery();
    cy.contains("No files found");
  });
});
