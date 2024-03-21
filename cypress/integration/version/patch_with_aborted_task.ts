describe("Patch with aborted task", () => {
  it("Shows status `aborted` in task table for tasks that were aborted", () => {
    cy.visit("/version/5e94c2dfe3c3312519b59480");
    cy.dataCy("tasks-table-row")
      .eq(0)
      .within(() => {
        cy.dataCy("task-status-badge").should("have.text", "Aborted");
      });
  });
});
