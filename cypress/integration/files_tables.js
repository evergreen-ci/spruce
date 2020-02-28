/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const waitForFilesQuery = () => waitForGQL("@gqlQuery", "taskFiles");
const FILES_ROUTE = "/task/wuzzup-activated/files";
describe("tests table", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("Should not render table when invalid TaskID in the url", () => {
    cy.visit("/task/NO-SUCH-THANG/tests");
    waitForGQL("@gqlQuery", "GetTask");
    cy.get(".ant-table").should("not.exist");
  });

  it("File names under name column should have target=_blank attribute", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".fileLink").should("have.attr", "target", "_blank");
  });

  it("Searching for Hello world yields 0 results and tables will not render", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".ant-input").type("Hello world");
    cy.wait(350); // wait because input has debounce
    cy.get(".ant-table").should("not.exist");
    cy.get(".fileLink").should("not.exist");
  });

  it("Searching for 458 yields 4 results across 4 tables", () => {
    cy.visit(FILES_ROUTE);
    waitForFilesQuery();
    cy.get(".ant-input").type("458");
    cy.wait(350); // wait because input has debounce
    cy.get(".fileLink").should("have.length", 4);
  });
});
