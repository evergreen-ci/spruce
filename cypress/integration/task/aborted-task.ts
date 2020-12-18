const patchWithAbortedTask = "/version/5ee1efb3d1fe073e194e8b5c";
const tasksTableNameCell = ".cy-task-table-col-NAME";

describe("Task table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Link to failing task in task metadata should exist for aborted tasks", () => {
    // NAVIGATE TO ABORTED TASK FROM PATCH DETAILS PAGE
    cy.visit(patchWithAbortedTask);
    cy.get(
      "[data-row-key=mongodb_mongo_master_enterprise_rhel_62_64_bit_dbtest_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06]"
    ).within(() =>
      cy.get(tasksTableNameCell).within(() => cy.get("a").click())
    );

    // ABORT REASON LINK SHOULD EXIST
    cy.dataCy("abort-message-failing-task")
      .should("have.attr", "href")
      .and(
        "eq",
        "/task/mongodb_mongo_master_commit_queue_validate_commit_message_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06"
      );
  });

  it("Link to failing task in task metadata should NOT exist for non-aborted tasks", () => {
    cy.visit(patchWithAbortedTask);
    cy.get(
      "[data-row-key=mongodb_mongo_master_commit_queue_validate_commit_message_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06]"
    ).within(() =>
      cy.get(tasksTableNameCell).within(() => cy.get("a").click())
    );

    cy.dataCy("abort-message-failing-task").should("not.exist");
  });
});
