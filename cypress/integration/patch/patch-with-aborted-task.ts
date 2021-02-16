describe("Patch with aborted task", () => {
  before(() => {
    cy.login();
  });

  it("Shows status `aborted` in task table for tasks that were aborted", () => {
    cy.visit("/version/5ee1efb3d1fe073e194e8b5c");
    cy.get(
      "[data-row-key=mongodb_mongo_main_enterprise_rhel_62_64_bit_dbtest_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06]"
    ).within(() => {
      cy.get(".cy-task-table-col-STATUS").should("have.text", "Aborted");
      cy.get(".cy-task-table-col-BASE_STATUS").should(
        "not.have.text",
        "Aborted"
      );
    });
  });
});
