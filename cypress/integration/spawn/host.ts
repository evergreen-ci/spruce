const ascendingSortSpawnHostOrderByHostId = [
  "i-04ade558e1e26b0ad",
  "i-092593689871a50dc",
];
const descendingSortSpawnHostOrderByHostId = [
  "i-092593689871a50dc",
  "i-04ade558e1e26b0ad",
];

const descendingSortSpawnHostOrderByExpiration = [
  "i-04ade558e1e26b0ad",
  "i-092593689871a50dc",
];
const ascendingSortSpawnHostOrderByExpiration = [
  "i-092593689871a50dc",
  "i-04ade558e1e26b0ad",
];

const hostTaskId =
  "evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46";
const distroId = "windows-64-vs2015-small";

describe("Navigating to Spawn Host page", () => {
  beforeEach(() => {
    cy.visit("/spawn/host");
  });
  it("Visiting the spawn host page should display all of your spawned hosts", () => {
    cy.dataCy("leafygreen-table-row").should("have.length", 2);
  });
  it("Visiting the spawn host page should not have any cards expanded by default", () => {
    cy.dataCy("spawn-host-card").should("not.exist");
  });
  it("Clicking on a spawn host row should toggle the host card", () => {
    cy.get("button[aria-label='Expand row']").first().click();
    cy.dataCy("spawn-host-card").should("be.visible");
    cy.get("button[aria-label='Collapse row']").first().click();
    cy.dataCy("spawn-host-card").should("not.be.visible");
  });
  it("Visiting the spawn host page with an id in the url should open the page with the row expanded", () => {
    cy.visit("/spawn/host?host=i-092593689871a50dc");
    cy.dataCy("spawn-host-card").first().should("be.visible");
    cy.dataCy("spawn-host-card").eq(1).should("not.be.visible");
  });
  it("Clicking on the Event Log link should redirect to /host/:hostId", () => {
    cy.contains('[data-cy="leafygreen-table-row"]', "i-092593689871a50dc")
      .find("button[aria-label='Expand row']")
      .click();
    cy.contains("Event Log").click();
    cy.location("pathname").should("eq", "/host/i-092593689871a50dc");
  });

  describe("Spawn host card sorting", () => {
    beforeEach(() => {
      cy.visit("/spawn/host");
    });

    it("Visiting the spawn host page should display all of your spawned hosts not sorted by default", () => {
      cy.dataCy("leafygreen-table-row").should("have.length", 2);
    });

    it("Clicking on the host column header should sort spawn hosts by ascending order, then descending, then remove sort", () => {
      cy.get("button[aria-label='Sort by Host']").as("hostSortControl").click();
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByHostId[index])
      );
      cy.get("@hostSortControl").click();
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByHostId[index])
      );
      cy.get("@hostSortControl").click();
      cy.dataCy("leafygreen-table-row").should("have.length", 2);
    });

    it("Clicking on the expiration column header should sort the hosts by ascending order, then descending, then remove sort", () => {
      cy.get("button[aria-label='Sort by Expires In']")
        .as("expiresInSortControl")
        .click();
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByExpiration[index])
      );
      cy.get("@expiresInSortControl").click();
      cy.dataCy("leafygreen-table-row").each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByExpiration[index])
      );
      cy.get("@expiresInSortControl").click();
      cy.dataCy("leafygreen-table-row").should("have.length", 2);
    });
  });

  describe("Spawn host modal", () => {
    it("Should disable 'Never expire' checkbox when max number of unexpirable hosts is met (2)", () => {
      cy.visit("/spawn/host");
      cy.contains("Spawn a host").click();
      cy.dataCy("distro-input").click();
      cy.dataCy("distro-option-ubuntu1804-workstation")
        .should("be.visible")
        .click();
      cy.dataCy("never-expire-checkbox").should(
        "have.attr",
        "aria-checked",
        "false"
      );
      cy.dataCy("never-expire-checkbox").should(
        "have.css",
        "pointer-events",
        "none"
      );
    });

    it("Clicking on the spawn host button should open a spawn host modal.", () => {
      cy.visit("/spawn/host");
      cy.dataCy("spawn-host-modal").should("not.exist");
      cy.dataCy("spawn-host-button").click();
      cy.dataCy("spawn-host-modal").should("be.visible");
    });
    it("Visiting the spawn host page with the proper url param should open the spawn host modal by default", () => {
      cy.visit("/spawn/host?spawnHost=True ");
      cy.dataCy("spawn-host-modal").should("be.visible");
    });
    it("Closing the spawn host modal removes the 'spawnHost' query param from the url and hides the modal", () => {
      cy.visit("/spawn/host?spawnHost=True ");
      cy.dataCy("spawn-host-modal").should("be.visible");
      cy.location().should(({ search }) => {
        expect(search).to.include("spawnHost=True");
      });
      cy.dataCy("spawn-host-modal").contains("Cancel").click();
      cy.location().should(({ search }) => {
        expect(search).to.not.include("spawnHost");
      });
      cy.dataCy("spawn-host-modal").should("not.exist");
    });
    it("Visiting the spawn host page with a taskId url param should render additional options at the bottom of the modal.", () => {
      cy.visit(
        `spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`
      );
      cy.dataCy("spawn-host-modal").should("contain.text", label1);
      cy.dataCy("spawn-host-modal").should(
        "contain.text",
        "Load data for dist on ubuntu1604"
      );
      cy.dataCy("spawn-host-modal").should("contain.text", label2);
      cy.dataCy("spawn-host-modal").should("contain.text", label3);
    });

    it("Unchecking 'Load data for dist' hides nested checkbox selections and checking shows them.", () => {
      cy.visit(
        `spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`
      );
      cy.dataCy("spawn-host-modal").should("be.visible");
      cy.dataCy("load-data-checkbox").should("be.checked");
      cy.contains(label1).should("be.visible");
      cy.contains(label2).should("be.visible");
      cy.contains(label3).should("be.visible");

      cy.dataCy("load-data-checkbox").click({ force: true });
      cy.dataCy("load-data-checkbox").should("not.be.checked");
      cy.contains(label1).should("not.exist");
      cy.contains(label2).should("not.exist");
      cy.contains(label3).should("not.exist");
    });

    it("Visiting the spawn host page with a task and distro supplied in the url should populate the distro input", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      cy.dataCy("spawn-host-modal").should("be.visible");
      cy.dataCy("distro-input").dataCy("dropdown-value").contains(distroId);
    });
    it("The virtual workstation dropdown should filter any volumes that aren't a home volume", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      cy.dataCy("distro-input").click();
      cy.dataCy("distro-option-ubuntu1804-workstation")
        .should("be.visible")
        .click();
      cy.dataCy("volume-select").should("have.attr", "aria-disabled", "true");
    });

    it("Clicking 'Add new key' hides the key name dropdown and shows the key value text area", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      cy.dataCy("key-select").should("be.visible");
      cy.dataCy("key-value-text-area").should("not.exist");
      cy.contains("Add new key").click();
      cy.dataCy("key-select").should("not.exist");
      cy.dataCy("key-value-text-area").should("be.visible");
    });

    it("Checking 'Run Userdata script on start' shows the user data script text area", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      cy.dataCy("run-user-data-script-text-area").should("not.exist");
      cy.contains("Run Userdata script on start").click();
      cy.dataCy("user-data-script-text-area").should("be.visible");
    });

    it("Checking 'Define setup script...' shows the setup script text area", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      cy.dataCy("setup-script-text-area").should("not.exist");
      cy.contains(
        "Define setup script to run after host is configured (i.e. task data and artifacts are loaded"
      ).click();
      cy.dataCy("setup-script-text-area").should("be.visible");
    });

    it("Conditionally disables setup script and project setup script checkboxes based on the other's value", () => {
      cy.visit(
        `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
      );
      // Checking setup script should disable project setup script.
      cy.dataCy("setup-script-checkbox").check({ force: true });
      cy.dataCy("project-setup-script-checkbox").should(
        "have.attr",
        "aria-disabled",
        "true"
      );
      // Unchecking setup script should reenable project setup script.
      cy.dataCy("setup-script-checkbox").uncheck({ force: true });
      cy.dataCy("project-setup-script-checkbox").should(
        "have.attr",
        "aria-disabled",
        "false"
      );
      // Checking project setup script should disable setup script.
      cy.dataCy("project-setup-script-checkbox").check({ force: true });
      cy.dataCy("setup-script-checkbox").should(
        "have.attr",
        "aria-disabled",
        "true"
      );
    });
    const label1 = "Use project-specific setup script defined at /path";
    const label2 = "Load from task sync";
    const label3 = "Also start any hosts this task started (if applicable)";
  });
});
