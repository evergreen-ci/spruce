// / <reference types="Cypress" />
import { popconfirmYesClassName } from "../../utils/popconfirm";

describe("Navigating to Spawn Volume page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Visiting the spawn volume page should display the number of free and mounted volumes.", () => {
    cy.visit("/spawn/volume");
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });

  it("The table initally displays volumes with status ascending.", () => {
    cy.dataCy("vol-name").each(($el, index) =>
      cy.wrap($el).contains(expectedVolNames[index])
    );
  });

  it("Table should have no cards visible by default.", () => {
    cy.wrap(expectedVolNames).each((cardName) => {
      cy.dataCy(cardName).should("not.be.visible");
    });
  });

  it("Should have 1 volume card visible initially when the 'volume' query param is provided.", () => {
    cy.visit("/spawn/volume?volume=vol-0ea662ac92f611ed4");
  });

  it("Clicking on a volume table row should open a card", () => {
    const cardDataCy =
      "spawn-volume-card-1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0";
    cy.dataCy(cardDataCy).should("not.exist");
    cy.contains(
      "1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0"
    ).click();
    cy.dataCy(cardDataCy).should("exist");
  });

  it("Click the trash can should remove the volume from the table.", () => {
    cy.contains("vol-0ae8720b445b771b6");
    cy.dataCy("trash-vol-0ae8720b445b771b6").click();
    cy.get(popconfirmYesClassName).click();
    cy.contains("vol-0ae8720b445b771b6").should("not.exist");
  });

  const expectedVolNames = [
    "1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0",
    "vol-0c66e16459646704d",
    "vol-0583d66433a69f136",
    "vol-0ea662ac92f611ed4",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "vol-0ae8720b445b771b6",
  ];
});
