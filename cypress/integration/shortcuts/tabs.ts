describe("Tab shortcut", () => {
  it("toggle through tabs with 'j' and 'k' on version page", () => {
    cy.visit("/version/5f74d99ab2373627c047c5e5/");

    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("duration-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("downstream-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");

    cy.get("body").type("k");
    cy.dataCy("downstream-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("duration-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");
  });

  it("toggle through tabs with 'j' and 'k' on configure page", () => {
    cy.visit("/patch/5f74d99ab2373627c047c5e5/configure");

    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("parameters-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");

    cy.get("body").type("k");
    cy.dataCy("parameters-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");
  });

  it("toggle through tabs with 'j' and 'k' on the task page", () => {
    cy.visit(
      "task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/",
    );
    cy.dataCy("task-execution-tab").should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get("body").type("j");
    cy.dataCy("task-files-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("task-tests-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("task-execution-tab").should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get("body").type("j");
    cy.dataCy("task-files-tab").should("have.attr", "aria-selected", "true");

    cy.get("body").type("k");
    cy.dataCy("task-execution-tab").should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get("body").type("k");
    cy.dataCy("task-tests-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("task-files-tab").should("have.attr", "aria-selected", "true");
  });
});
