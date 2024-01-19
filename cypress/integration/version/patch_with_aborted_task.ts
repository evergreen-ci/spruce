describe("Patch with aborted task", () => {
  it("Shows status `aborted` in task table for tasks that were aborted", () => {
    cy.visit("version/5e94c2dfe3c3312519b59480");
    const taskId =
      "mongodb_mongo_master_merge_patch_977e984bf4ed5a406da11af800c12356d0975502_5e94c2dfe3c3312519b59480_20_04_13_19_52_11";
    cy.get(`[data-row-key=${taskId}] > .cy-task-table-col-STATUS`).within(
      () => {
        cy.dataCy("task-status-badge").should("have.text", "Aborted");
      },
    );
  });
});
