// / <reference types="Cypress" />

const tableRow = "tr.ant-table-row";
const hostColumnHeader =
  ":nth-child(1) > .ant-table-header-column > .ant-table-column-sorters";

const unsortedSpawnHostOrder = [
  "rhel71-ppc-1.pic.build.10gen",
  "i-04ade558e1e26b0ad",
];
const ascendingSortSpawnHostOrderByHostId = [
  "i-04ade558e1e26b0ad",
  "rhel71-ppc-1.pic.build.10gen",
];
const descendingSortSpawnHostOrderByHostId = [
  "rhel71-ppc-1.pic.build.10gen",
  "i-04ade558e1e26b0ad",
];

const descendingSortSpawnHostOrderByExpiration = [
  "i-04ade558e1e26b0ad",
  "rhel71-ppc-1.pic.build.10gen",
];
const ascendingSortSpawnHostOrderByExpiration = [
  "rhel71-ppc-1.pic.build.10gen",
  "i-04ade558e1e26b0ad",
];

describe("Navigating to Spawn Host page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Visiting the spawn host page should display all of your spawned hosts", () => {
    cy.visit("/spawn/host");
    cy.get(tableRow).should("have.length", 2);
  });
  it("Visiting the spawn host page should display all of your spawned hosts not sorted by default", () => {
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(unsortedSpawnHostOrder[index])
    );
  });
  it("Clicking on the host column header should sort spawn hosts by ascending order by id", () => {
    cy.get(hostColumnHeader).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(ascendingSortSpawnHostOrderByHostId[index])
    );
  });
  it("Clicking on the host column header a second time should sort spawn hosts by decending order by id", () => {
    cy.get(hostColumnHeader).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(descendingSortSpawnHostOrderByHostId[index])
    );
  });
  it("Clicking on the host column header a third  time should return the spawn host table to its original state", () => {
    cy.get(hostColumnHeader).click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(unsortedSpawnHostOrder[index])
    );
  });
  it("Clicking on the expiration column header should sort the hosts by ascending order", () => {
    cy.contains("Expires In").click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(ascendingSortSpawnHostOrderByExpiration[index])
    );
  });
  it("Clicking on the expiration column header should sort the hosts by descending order", () => {
    cy.contains("Expires In").click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(descendingSortSpawnHostOrderByExpiration[index])
    );
  });
  it("Clicking on the expiration column header a third  time should return the spawn host table to its original state", () => {
    cy.contains("Expires In").click();
    cy.get(tableRow).each(($el, index) =>
      cy.wrap($el).contains(unsortedSpawnHostOrder[index])
    );
  });
});
