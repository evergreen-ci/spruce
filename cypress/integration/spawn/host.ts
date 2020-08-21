// / <reference types="Cypress" />

const hostTableRow = ".ant-table-row";
const hostColumnHeader =
  ":nth-child(2) > .ant-table-column-sorters-with-tooltip";

const unsortedSpawnHostOrder = ["i-092593689871a50dc", "i-04ade558e1e26b0ad"];
const ascendingSortSpawnHostOrderByHostId = [
  "i-04ade558e1e26b0ad",
  "i-092593689871a50dc",
];
const descendingSortSpawnHostOrderByHostId = [
  "i-092593689871a50dc",
  "i-04ade558e1e26b0ad",
];

const descendingSortSpawnHostOrderByExpiration = [
  "i-04ade558e1e26b0ad",
  "i-092593689871a50dc",
];
const ascendingSortSpawnHostOrderByExpiration = [
  "i-092593689871a50dc",
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
    cy.get(hostTableRow).should("have.length", 2);
  });
  it("Visiting the spawn host page should not have any cards expanded by default", () => {
    cy.dataCy("spawn-host-card").should("not.be.visible");
  });
  it("Clicking on a spawn host row should expand it and show more info about the host in a card", () => {
    cy.get('[data-row-key="i-092593689871a50dc"] > :nth-child(2)').click();
    cy.dataCy("spawn-host-card").should("be.visible");
  });
  it("Clicking on a spawn host row should toggle the card closed", () => {
    cy.get('[data-row-key="i-092593689871a50dc"] > :nth-child(2)').click();
    cy.dataCy("spawn-host-card").should("not.be.visible");
  });
  it("Visiting the spawn host page with an id in the url should open the page with the row expanded", () => {
    cy.visit("/spawn/host?host=i-092593689871a50dc");
    cy.dataCy("spawn-host-card").should("be.visible");
    cy.dataCy("spawn-host-card").should("have.length", 1);
  });
  describe("Spawn host card sorting", () => {
    it("Visiting the spawn host page should display all of your spawned hosts not sorted by default", () => {
      cy.visit("/spawn/host");
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });
    it("Clicking on the host column header should sort spawn hosts by ascending order by id", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByHostId[index])
      );
    });
    it("Clicking on the host column header a second time should sort spawn hosts by decending order by id", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByHostId[index])
      );
    });
    it("Clicking on the host column header a third  time should return the spawn host table to its original state", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });
    it("Clicking on the expiration column header should sort the hosts by ascending order", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByExpiration[index])
      );
    });
    it("Clicking on the expiration column header should sort the hosts by descending order", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByExpiration[index])
      );
    });
    it("Clicking on the expiration column header a third  time should return the spawn host table to its original state", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });
  });
});
