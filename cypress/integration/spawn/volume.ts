describe("Spawn volume page", () => {
  beforeEach(() => {
    cy.visit("/spawn/volume");
  });
  it("Visiting the spawn volume page should display the number of free and mounted volumes.", () => {
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });

  it("The table initially displays volumes with status ascending.", () => {
    cy.dataCy("leafygreen-table-row").each(($el, index) =>
      cy.contains(expectedVolNames[index])
    );
  });

  it("Table should have no cards visible by default.", () => {
    expectedVolNames.forEach((cardName) => {
      cy.dataCy(cardName).should("not.exist");
    });
  });

  it("Should render migrating volumes with a different badge and disable action buttons", () => {
    cy.contains(
      '[data-cy="leafygreen-table-row"]',
      "vol-0ae8720b445b771b6"
    ).within(() => {
      cy.dataCy("volume-status-badge").contains("Migrating");
      cy.get("button[aria-label!='Expand row']").should(
        "have.attr",
        "aria-disabled",
        "true"
      );
    });
  });

  it("Should have a volume card visible initially when the 'volume' query param is provided.", () => {
    cy.visit("/spawn/volume?volume=vol-0ea662ac92f611ed4");
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("exist");
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").scrollIntoView();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
  });

  it("Clicking on the row should toggle the volume card open and closed", () => {
    cy.visit("/spawn/volume?volume=vol-0ea662ac92f611ed4");
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
    cy.contains('[data-cy="leafygreen-table-row"]', "vol-0ea662ac92f611ed4")
      .find("button[aria-label='Collapse row']")
      .click();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should(
      "not.be.visible"
    );
    cy.contains('[data-cy="leafygreen-table-row"]', "vol-0ea662ac92f611ed4")
      .find("button[aria-label='Expand row']")
      .click();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
  });

  it("Clicking the trash can should remove the volume from the table and update free/mounted volumes badges.", () => {
    cy.contains(
      '[data-cy="leafygreen-table-row"]',
      "vol-0c66e16459646704d"
    ).should("exist");
    cy.dataCy("trash-vol-0c66e16459646704d").click();
    cy.dataCy("delete-volume-popconfirm").should("be.visible");
    cy.dataCy("delete-volume-popconfirm").within(($el) => {
      cy.wrap($el)
        .contains("Yes")
        .should("be.visible")
        .should("not.have.attr", "aria-disabled", "true");
      cy.wrap($el).contains("Yes").click();
    });
    cy.contains(
      '[data-cy="leafygreen-table-row"]',
      "vol-0c66e16459646704d"
    ).should("not.exist");
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("3 Free");
  });

  it("Clicking the trash can for a mounted volume should show an additional confirmation checkbox which enables the submit button when checked.", () => {
    cy.dataCy(
      "trash-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    ).click();
    cy.dataCy("delete-volume-popconfirm").should("be.visible");
    cy.dataCy("delete-volume-popconfirm").within(($el) => {
      cy.wrap($el)
        .getInputByLabel(
          "I understand this volume is currently mounted to a host."
        )
        .should("not.be.checked");
      cy.wrap($el).contains("Yes");
      cy.wrap($el).contains("Yes").should("have.attr", "aria-disabled", "true");
      cy.wrap($el)
        .getInputByLabel(
          "I understand this volume is currently mounted to a host."
        )
        .check({ force: true });
      cy.wrap($el)
        .contains("Yes")
        .should("not.have.attr", "aria-disabled", "true")
        .click();
    });
    cy.dataCy("mounted-badge").contains("8 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });

  it("Clicking on unmount should result in a success toast appearing.", () => {
    cy.dataCy(
      "detach-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857"
    ).click();
    cy.contains("button", "Yes").click();
    cy.validateToast("success");
  });

  it("Clicking on 'Spawn Volume' should open the Spawn Volume Modal", () => {
    cy.dataCy("spawn-volume-btn").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("spawn-volume-btn").click();
    cy.dataCy("spawn-volume-modal").should("be.visible");
  });

  it("Reopening the Spawn Volume modal clears previous input changes.", () => {
    cy.dataCy("spawn-volume-btn").click();
    cy.dataCy("spawn-volume-modal").should("be.visible");
    cy.selectLGOption("Type", "sc1");
    cy.dataCy("spawn-volume-modal").within(() => {
      cy.contains("button", "Cancel").should(
        "not.have.attr",
        "aria-disabled",
        "true"
      );
      cy.contains("button", "Cancel").click({ force: true });
    });

    cy.dataCy("spawn-volume-btn").click();
    cy.dataCy("spawn-volume-modal").should("be.visible");
    cy.dataCy("type-select").contains("gp2");
  });

  describe("Edit volume modal", () => {
    beforeEach(() => {
      cy.visit("/spawn/volume");
    });
    it("Clicking on 'Edit' should open the Edit Volume Modal", () => {
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
    });

    it("Volume name & expiration inputs should be populated with the volume display name & expiration on initial render", () => {
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
      cy.dataCy("volume-name-input").should(
        "have.value",
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      );
      cy.dataCy("date-picker").should("have.value", "2020-06-06");
      cy.dataCy("time-picker").should("have.value", "15:48:18"); // Defaults to UTC
    });

    it("Reopening the edit volume modal should reset form input fields.", () => {
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
      cy.dataCy("volume-name-input").type("Hello, World");
      cy.dataCy("update-volume-modal").within(() => {
        cy.contains("button", "Cancel").click();
      });
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("volume-name-input").should(
        "have.value",
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      );
    });

    it("Submit button should be enabled when the volume details input value differs from what already exists.", () => {
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
      cy.contains("button", "Save").should(
        "have.attr",
        "aria-disabled",
        "true"
      );
      // type a new name
      cy.dataCy("volume-name-input").type("Hello, World");
      cy.contains("button", "Save").should(
        "not.have.attr",
        "aria-disabled",
        "true"
      );

      // type original name
      cy.dataCy("volume-name-input").clear();
      cy.dataCy("volume-name-input").type(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      );
      cy.contains("button", "Save").should(
        "have.attr",
        "aria-disabled",
        "true"
      );

      cy.contains("Never").click();
      cy.contains("button", "Save").should(
        "not.have.attr",
        "aria-disabled",
        "true"
      );
    });

    it("Clicking on save button should close the modal and show a success toast", () => {
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
      cy.dataCy("volume-name-input").type("Hello, World");
      cy.contains("button", "Save").should(
        "not.have.attr",
        "aria-disabled",
        "true"
      );
      cy.contains("button", "Save").click();
      cy.validateToast("success", "Successfully updated volume");
      cy.dataCy("update-volume-modal").should("not.exist");
    });
  });

  describe("Migrate Modal", () => {
    beforeEach(() => {
      cy.visit("/spawn/volume");
    });
    it("migrate button is disabled for volumes with the migrating status", () => {
      cy.contains('[data-cy="leafygreen-table-row"]', "vol-0ae8720b445b771b6")
        .find("[data-cy=volume-status-badge]")
        .contains("Migrating");
      cy.dataCy("migrate-btn-vol-0ae8720b445b771b6").should(
        "have.attr",
        "aria-disabled",
        "true"
      );
    });
    it("clicking cancel during confirmation renders the Migrate modal form", () => {
      cy.dataCy(
        "migrate-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("distro-input").should("be.visible").click();
      cy.dataCy("distro-option-ubuntu1804-workstation").click();
      cy.dataCy("migrate-modal").contains("Next").click({ force: true });
      cy.dataCy("migrate-modal").contains(
        "Are you sure you want to migrate this home volume?"
      );
      cy.dataCy("distro-input").should("not.exist");
      cy.dataCy("migrate-modal").contains("Cancel").click({ force: true });
      cy.dataCy("distro-input").should("be.visible");
    });
    it("open the Migrate modal and spawn a host", () => {
      cy.dataCy(
        "migrate-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("distro-input").click();
      cy.dataCy("distro-option-ubuntu1804-workstation").click();
      cy.dataCy("region-select").should("have.attr", "aria-disabled", "true");
      cy.dataCy("migrate-modal").contains("Next").click({ force: true });
      cy.dataCy("migrate-modal")
        .contains("Migrate Volume")
        .click({ force: true });
      cy.validateToast(
        "success",
        "Volume migration has been scheduled. A new host will be spawned and accessible on your Hosts page."
      );
    });
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
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b835",
    "vol-0ae8720b445b771b6",
  ];
});
