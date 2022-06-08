// / <reference types="Cypress" />

describe("Navigating to Spawn Volume page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Edit volume modal", () => {
    it("Clicking on 'Edit' should open the Edit Volume Modal", () => {
      cy.visit("/spawn/volume");
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("update-volume-modal").should("be.visible");
    });

    it("Volume name & expiration inputs should be populated with the volume display name & expiration on initial render", () => {
      cy.dataCy("volume-name-input").should(
        "have.value",
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      );
      cy.dataCy("date-picker").should("have.value", "2020-06-06");
      cy.dataCy("time-picker").should("have.value", "15:48:18");
    });

    it("Reopening the edit volume modal should reset form input fields.", () => {
      cy.dataCy("volume-name-input").type("Hello, World");
      cy.dataCy("cancel-volume-button").click();
      cy.dataCy(
        "edit-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      ).click();
      cy.dataCy("volume-name-input").should(
        "have.value",
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
      );
    });

    it("Submit button should be enabled when the volume details input value differs from what already exists.", () => {
      cy.dataCy("update-volume-button").should("be.disabled");
      // type a new name
      cy.dataCy("volume-name-input").type("Hello, World");
      cy.dataCy("update-volume-button").should("not.be.disabled");

      // type original name
      cy.dataCy("volume-name-input")
        .clear()
        .type(
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b858"
        );
      cy.dataCy("update-volume-button").should("be.disabled");

      cy.contains("Never").click();
      cy.dataCy("update-volume-button").should("not.be.disabled");
    });

    it("Clicking on save button should close the modal and show a success toast", () => {
      cy.dataCy("update-volume-button").click();
      cy.contains("Successfully updated volume");
      cy.dataCy("update-volume-modal").should("not.exist");
    });
  });

  it("Visiting the spawn volume page should display the number of free and mounted volumes.", () => {
    cy.visit("/spawn/volume");
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("4 Free");
  });

  it("The table initially displays volumes with status ascending.", () => {
    cy.dataCy("vol-name").each(($el, index) =>
      cy.wrap($el).contains(expectedVolNames[index])
    );
  });

  it("Table should have no cards visible by default.", () => {
    expectedVolNames.forEach((cardName) => {
      cy.dataCy(cardName).should("not.exist");
    });
  });

  it("Should have a volume card visible initially when the 'volume' query param is provided.", () => {
    cy.visit("/spawn/volume?volume=vol-0ea662ac92f611ed4");
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("exist");
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").scrollIntoView();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
  });

  it("Clicking on the row should toggle the volume card open and closed", () => {
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
    cy.dataRowKey("vol-0ea662ac92f611ed4").click();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should(
      "not.be.visible"
    );
    cy.dataRowKey("vol-0ea662ac92f611ed4").click();
    cy.dataCy("spawn-volume-card-vol-0ea662ac92f611ed4").should("be.visible");
  });

  it("Click the trash can should remove the volume from the table and update free/mounted volumes badges.", () => {
    cy.visit("/spawn/volume");
    cy.dataRowKey("vol-0c66e16459646704d").should("exist");
    cy.dataCy("trash-vol-0c66e16459646704d").click();
    cy.get(".ant-popover").should("be.visible");
    cy.get(".ant-popover").within(($el) => {
      cy.wrap($el).contains("Yes").should("not.be.disabled");
      cy.wrap($el).contains("Yes").click();
    });
    cy.dataRowKey("vol-0c66e16459646704d").should("not.exist");
    cy.dataCy("mounted-badge").contains("9 Mounted");
    cy.dataCy("free-badge").contains("3 Free");
  });

  it("Click the trash can for a mounted volume should show an additional confirmation checkbox which enables the submit button when checked.", () => {
    cy.visit("/spawn/volume");
    cy.dataRowKey(
      "1de2728dd9de82efc02dc21f6ca046eaa559462414d28e0b6bba6436436ac873"
    ).should("exist");
    cy.dataCy(
      "trash-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    ).click();
    cy.get(".ant-popover").should("be.visible");
    cy.get(".ant-popover").within(($el) => {
      cy.wrap($el)
        .getInputByLabel(
          "I understand this volume is currently mounted to a host."
        )
        .should("not.be.checked");
      cy.wrap($el).contains("Yes");
      cy.wrap($el).contains("Yes").should("be.disabled");
      cy.wrap($el)
        .getInputByLabel(
          "I understand this volume is currently mounted to a host."
        )
        .check({ force: true });
      cy.wrap($el).contains("Yes").should("not.be.disabled");
    });
    // TODO: fix in EVG-16481 This should assert what happens when we click Yes above
    // cy.dataRowKey(
    //   "1de2728dd9de82efc02dc21f6ca046eaa559462414d28e0b6bba6436436ac873"
    // ).should("not.exist");
    // cy.dataCy("mounted-badge").contains("8 Mounted");
    // cy.dataCy("free-badge").contains("3 Free");
  });

  // Confirm what the appropriate behavior is why would an error toast appear?
  // it("Clicking on unmount should result in a new error toast appearing.", () => {
  //   cy.contains(errorBannerCopy).should("not.exist");
  //   cy.dataCy(
  //     "detach-btn-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b835"
  //   ).click();
  //   cy.get(popconfirmYesClassName).click();
  // cy.contains(errorBannerCopy).should("exist");
  // });

  it("Clicking on mount, selecting a host and submitting should result in a new error toast appearing.", () => {
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

  it("Reopening the Spawn Volume modal clears previous input changes.", () => {
    cy.dataCy("typeSelector").click();
    cy.contains("sc1").click();
    cy.contains("Never").click();
    cy.dataCy("cancel-button").click();
    cy.dataCy("spawn-volume-btn").click();
    cy.dataCy("typeSelector").contains("gp2");
    cy.dataCy("neverExpireCheckbox").should(
      "have.attr",
      "aria-checked",
      "false"
    );
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
  // const errorBannerCopy =
  //  "Error detaching volume: 'can't detach volume '8191ed590dc4668fcc65029eb332134be9de44e742098b6ee1a0723aec175784': unable to fetch host: b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08'";
  const errorBannerCopy2 =
    "Error attaching volume: 'can't attach volume 'vol-0ea662ac92f611ed4': unable to fetch host: i-04ade558e1e26b0ad'";
});
