// / <reference types="Cypress" />
import { popconfirmYesClassName } from "../../utils/popconfirm";

describe("Navigating to Spawn Volume page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.viewport(1920, 1600);
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
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
  });

  it("Clicking on the row above an open volume card will hide the card", () => {
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
    cy.dataRowKey("vol-0ea662ac92f611ed4").click();
    cy.dataCy("volume-card-vol-0ea662ac92f611ed4").should("not.be.visible");
  });

  it("Clicking on a volume table row should open a card", () => {
    const cardDataCy =
      "spawn-volume-card-1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0";
    cy.dataCy(cardDataCy).should("not.exist");
    cy.dataRowKey(
      "1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0"
    ).click();
    cy.dataCy(cardDataCy).should("exist");
  });

  it("Click the trash can should remove the volume from the table and update free/mounted volumes badges.", () => {
    cy.visit("/spawn/volume");
    cy.dataRowKey("vol-0ae8720b445b771b6").should("exist");
    cy.dataCy("trash-vol-0ae8720b445b771b6").click();
    cy.get(popconfirmYesClassName).click();
    cy.dataRowKey("vol-0ae8720b445b771b6").should("not.exist");
    cy.dataCy("mounted-badge").contains("8 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });

  it("Clicking on unmount should result in a new error banner appearing.", () => {
    cy.contains(errorBannerCopy).should("not.exist");
    cy.dataCy(
      "detach-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b835"
    ).click();
    cy.get(popconfirmYesClassName).click();
    cy.contains(errorBannerCopy).should("exist");
  });

  it("Switching tabs should clear the error banner.", () => {
    cy.contains(errorBannerCopy).should("exist");
    cy.dataCy("host-nav-tab").click();
    cy.dataCy("volume-nav-tab").click();
    cy.contains(errorBannerCopy).should("not.exist");
  });

  it("Clicking on mount, selecting a host and submitting should result in a new error banner appearing.", () => {
    cy.dataCy("attach-btn-vol-0ea662ac92f611ed4").click();
    cy.contains(errorBannerCopy2).should("not.exist");
    cy.dataCy("mount-volume-button").click();
    cy.contains(errorBannerCopy2).should("exist");
  });

  it("Clicking on 'Spawn Volume' should open the Spawn Volume Modal", () => {
    cy.visit("/spawn/volume");
    cy.dataCy("spawn-volume-btn").click();
    cy.dataCy("spawn-volume-modal").should("be.visible");
  });

  const expectedVolNames = [
    "1da0e996608e6871b60a92f6564bbc9cdf66ce90be1178dfb653920542a0d0f0",
    "vol-0c66e16459646704d",
    "vol-0583d66433a69f136",
    "vol-0ea662ac92f611ed4",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b815",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b859",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b825",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b835",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857",
    "vol-0ae8720b445b771b6",
  ];
  const errorBannerCopy =
    "Error detaching volume: 'can't detach volume '8191ed590dc4668fcc65029eb332134be9de44e742098b6ee1a0723aec175784': unable to fetch host: b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08'";
  const errorBannerCopy2 =
    "Error attaching volume: 'can't attach volume 'vol-0ea662ac92f611ed4': unable to fetch host: i-04ade558e1e26b0ad'";
});
