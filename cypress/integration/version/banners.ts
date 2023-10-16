describe("banners", () => {
  const versionWithBanners =
    "/version/logkeeper_e864cf934194c161aa044e4599c8c81cee7b6237/tasks?sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC";

  describe("errors", () => {
    beforeEach(() => {
      cy.visit(versionWithBanners);
    });

    it("should display the number of configuration errors", () => {
      cy.dataCy("configuration-errors-banner").should("be.visible");
      cy.contains("4 errors in configuration file").should("be.visible");
    });
    it("should be able to open the modal and see all errors", () => {
      cy.dataCy("configuration-errors-modal-trigger").click();
      cy.dataCy("configuration-errors-modal").should("be.visible");
      cy.get("ol").find("li").should("have.length", 4);
    });
  });

  describe("warnings", () => {
    beforeEach(() => {
      cy.visit(versionWithBanners);
    });

    it("should display the number of configuration warnings", () => {
      cy.dataCy("configuration-warnings-banner").should("be.visible");
      cy.contains("3 warnings in configuration file").should("be.visible");
    });
    it("should be able to open the modal and see all warnings", () => {
      cy.dataCy("configuration-warnings-modal-trigger").click();
      cy.dataCy("configuration-warnings-modal").should("be.visible");
      cy.get("ol").find("li").should("have.length", 3);
    });
  });

  describe("ignored", () => {
    it("should display a banner", () => {
      cy.visit("/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33");
      cy.dataCy("ignored-banner").should("be.visible");
    });

    it("should indicate if a version is ignored in the inactive commits tooltip", () => {
      cy.visit("/commits/spruce");
      cy.dataCy("ignored-icon").should("not.exist");
      cy.dataCy("inactive-commits-button").click();
      cy.dataCy("inactive-commits-tooltip").should("be.visible");
      cy.dataCy("ignored-icon").should("be.visible");
    });
  });
});
