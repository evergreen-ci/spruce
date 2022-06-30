// / <reference types="Cypress" />

const hostTableRow = ".ant-table-row";
const hostColumnHeader = ".ant-table-thead > tr > :nth-child(2)";

const unsortedSpawnHostOrder = ["i-092593689871a50dc", "i-04ade558e1e26b0ad"];
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
const distroId = "ubuntu1604-small";

describe("Navigating to Spawn Host page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Visiting the spawn host page should display all of your spawned hosts", () => {
    cy.visit("/spawn/host");
    cy.get(hostTableRow).should("have.length", 2);
  });
  it("Visiting the spawn host page should not have any cards expanded by default", () => {
    cy.dataCy("spawn-host-card").should("not.exist");
  });
  it("Clicking on a spawn host row should expand it and show more info about the host in a card", () => {
    cy.get('[data-row-key="i-092593689871a50dc"] > :nth-child(1)').click();
    cy.dataCy("spawn-host-card").should("be.visible");
  });
  it("Clicking on a spawn host row should toggle the card closed", () => {
    cy.get('[data-row-key="i-092593689871a50dc"] > :nth-child(1)').click();
    cy.dataCy("spawn-host-card").should("not.be.visible");
  });
  it("Visiting the spawn host page with an id in the url should open the page with the row expanded", () => {
    cy.visit("/spawn/host?host=i-092593689871a50dc");
    cy.dataCy("spawn-host-card").should("be.visible");
    cy.dataCy("spawn-host-card").should("have.length", 1);
  });
  it("Clicking on the Event Log link should redirect to /host/:hostId", () => {
    cy.visit("/spawn/host");
    cy.contains("Event Log").click();
    cy.location("pathname").should("eq", "/host/i-092593689871a50dc");
  });

  describe("Spawn host card sorting", () => {
    it("Visiting the spawn host page should display all of your spawned hosts not sorted by default", () => {
      cy.visit("/spawn/host");
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });
    it("Clicking on the host column header should sort spawn hosts by ascending order by id", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByHostId[index])
      );
    });
    it("Clicking on the host column header a second time should sort spawn hosts by decending order by id", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByHostId[index])
      );
    });
    it("Clicking on the host column header a third time should return the spawn host table to its original state", () => {
      cy.get(hostColumnHeader).click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });
    it("Clicking on the expiration column header should sort the hosts by ascending order", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(ascendingSortSpawnHostOrderByExpiration[index])
      );
    });
    it("Clicking on the expiration column header should sort the hosts by descending order", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(descendingSortSpawnHostOrderByExpiration[index])
      );
    });
    it("Clicking on the expiration column header a third  time should return the spawn host table to its original state", () => {
      cy.contains("Expires In").click();
      cy.get(hostTableRow).each(($el, index) =>
        cy.wrap($el).contains(unsortedSpawnHostOrder[index])
      );
    });

    describe("Spawn host modal", () => {
      it("Should disable 'Never expire' checkbox when max number of unexpirable hosts is met (2)", () => {
        cy.visit("/spawn/host");
        cy.contains("Spawn a host").click();
        cy.dataCy("distro-input")
          .click()
          .type("{downarrow}", { force: true })
          .type("{enter}", { force: true });
        cy.dataCy("distro-input").should(
          "have.attr",
          "value",
          "ubuntu1804-workstation"
        );
        cy.dataCy("neverExpireCheckbox").should(
          "have.attr",
          "aria-checked",
          "false"
        );
        cy.dataCy("neverExpireCheckbox").should(
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
      it("Visiting the spawn host page with a taskId url param should render additional options at the bottom of the modal.", () => {
        cy.visit(
          `spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`
        );
        cy.dataCy("spawn-host-modal").should(
          "contain.text",
          "Use project-specific setup script defined at /path"
        );
        cy.dataCy("spawn-host-modal").should(
          "contain.text",
          "Load data for dist on ubuntu1604"
        );
        cy.dataCy("spawn-host-modal").should(
          "contain.text",
          "Load from task sync"
        );
        cy.dataCy("spawn-host-modal").should(
          "contain.text",
          "Also start any hosts this task started (if applicable)"
        );
      });

      it("If 'Load data for dist' is unchecked, selecting one of it's children will check it.'", () => {
        cy.visit(
          `spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`
        );
        cy.dataCy("spawn-host-modal").should("be.visible");
        cy.dataCy("parent-checkbox").click({ force: true });
        cy.dataCy("parent-checkbox").should("not.be.checked");
        cy.dataCy("also-start-hosts").click({ force: true });
        cy.dataCy("parent-checkbox").should("be.checked");
      });

      it("If 'Load data for dist' is checked, deselecting all of it's checked children will uncheck it.'", () => {
        cy.visit(
          `spawn/host?spawnHost=True&distroId=rhel71-power8-large&taskId=${hostTaskId}`
        );
        cy.dataCy("spawn-host-modal").should("be.visible");
        cy.dataCy("parent-checkbox").should("be.checked");

        cy.dataCy("also-start-hosts").should("not.be.checked");
        cy.dataCy("also-start-hosts").check({ force: true });
        cy.dataCy("also-start-hosts").should("be.checked"); // check 1st child

        cy.dataCy("parent-checkbox").should("be.checked");

        cy.dataCy("use-psss").should("not.be.checked");
        cy.dataCy("use-psss").check({ force: true });
        cy.dataCy("use-psss").should("be.checked"); // check 2nd child

        cy.dataCy("parent-checkbox").should("be.checked");

        cy.dataCy("also-start-hosts").uncheck({ force: true }); // uncheck 1st child
        cy.dataCy("also-start-hosts").should("not.be.checked");
        cy.dataCy("parent-checkbox").should("be.checked"); // parent should be unchecked bc child 2 is selected

        cy.dataCy("use-psss").uncheck({ force: true });
        cy.dataCy("use-psss").should("not.be.checked"); // uncheck 2nd child

        cy.dataCy("parent-checkbox").should("not.be.checked");
      });

      it("Visiting the spawn host page with a task and distro supplied in the url should populate the distro input", () => {
        cy.visit(
          `/spawn/host?spawnHost=True&distroId=${distroId}&taskId=${hostTaskId}`
        );
        cy.dataCy("spawn-host-modal").should("be.visible");
        cy.dataCy("distro-input").should("have.value", "ubuntu1604-small");
      });
      it("The virtual workstation dropdown should filter any volumes that aren't a home volume", () => {
        cy.dataCy("distroSearchBox")
          .click()
          .type("{downarrow}")
          .type("{enter}");
        cy.dataCy("volume-select").click();
        cy.contains("No Data");
      });
    });
  });
});
