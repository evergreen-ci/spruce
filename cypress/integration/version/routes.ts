const versions = {
  0: "5ecedafb562343215a7ff297", // normal patch
  1: "i-dont-exist", // non existent patch
  2: "52a630633ff1227909000021", // patch 2
  3: "5e6bb9e23066155a993e0f1a", // unconfigured patch
  4: "5e94c2dfe3c3312519b59480", // unactivated patch on commit queue
  5: "evergreen_33016573166a36bd5f46b4111151899d5c4e95b1", // basecommit for versions[0]
  6: "5e4ff3abe3c3317e352062e4",
  7: "5f74d99ab2373627c047c5e5", // patch with downstream tasks
};

const versionRoute = (id: string) => `/version/${id}`;

describe("Version route", () => {
  describe("Redirects", () => {
    it("Redirects to configure patch page if patch is not activated", () => {
      cy.visit(versionRoute(versions[3]));
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(`/patch/${versions[3]}/configure/tasks`);
      });
    });
    it("Redirects to the commit queue page if a patch is on the commit queue and has not been activated", () => {
      cy.visit(versionRoute(versions[4]));
      cy.location().should((loc) => {
        expect(loc.pathname).to.equal(`/commit-queue/mongodb-mongo-master`);
      });
    });
    it("Throws a 404 if the version and patch doesn't exist", () => {
      cy.visit(versionRoute(versions[1]));
      cy.validateToast("error", "Unable to find patch or version i-dont-exist");
    });
  });

  describe("Metadata", () => {
    before(() => {
      cy.visit(versionRoute(versions[0]));
    });
    it("Shows patch parameters if they exist", () => {
      cy.dataCy("parameters-modal").should("not.exist");
      cy.dataCy("parameters-link").click();
      cy.dataCy("parameters-modal").should("be.visible");
      cy.get('button[aria-label="Close modal"]').click();
      cy.dataCy("parameters-modal").should("not.exist");
    });
    it("'Base commit' link in metadata links to version page", () => {
      cy.dataCy("patch-base-commit")
        .should("have.attr", "href")
        .and("include", `/version/${versions[5]}`);
    });
    it("Doesn't show patch parameters if they don't exist", () => {
      cy.visit(versionRoute(versions[2]));
      cy.dataCy("parameters-link").should("not.exist");
      cy.dataCy("parameters-modal").should("not.exist");
    });
  });

  describe("Build Variants", () => {
    before(() => {
      cy.visit(versionRoute(versions[0]));
    });

    it("Lists the patch's build variants", () => {
      cy.dataCy("direct-build-variants").within(() => {
        cy.dataCy("patch-build-variant").within(
          // @ts-expect-error
          ($variants) => Array.from($variants).length > 0
        );
      });
    });

    describe("Grouped Task Status Badge", () => {
      it("Shows tooltip with task's name on hover", () => {
        cy.dataCy("direct-build-variants").within(() => {
          cy.dataCy("grouped-task-status-badge")
            .first()
            .trigger("mouseover")
            .within(($el) => {
              // @ts-expect-error
              expect($el.text()).to.contain("1Undispatched");
            });
        });
      });

      it("Navigates to task tab and applies filters when clicking on grouped task status badge", () => {
        // click on a different tab first, so that we aren't on the task tab initially
        cy.dataCy("changes-tab").first().click();
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "false");

        // clicking on task status badge should move to the task tab
        cy.dataCy("direct-build-variants").within(() => {
          cy.dataCy("grouped-task-status-badge").first().click();
        });
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");
        cy.location("search").should(
          "include",
          "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=undispatched-umbrella,unscheduled,aborted,blocked&variant=%5Eubuntu1604%24"
        );

        // Check that filter values have updated.
        cy.toggleTableFilter(2);
        cy.getInputByLabel("Unscheduled")
          .should("have.attr", "aria-checked")
          .and("equal", "true");

        cy.toggleTableFilter(4);
        cy.dataCy("variant-input-wrapper")
          .find("input")
          .should("have.value", "^ubuntu1604$");
      });

      it("Keeps sorts but not other filters when clicking on grouped task status badge", () => {
        // Clear filters persisting from last test
        cy.dataCy("clear-all-filters").click();

        // Apply name filter
        cy.toggleTableFilter(1);
        cy.dataCy("taskname-input-wrapper")
          .find("input")
          .focus()
          .type("a-task-name")
          .type("{enter}");

        // name filter shouldn't be applied after clicking task status badge
        cy.dataCy("direct-build-variants").within(() => {
          cy.dataCy("grouped-task-status-badge").first().click();
        });
        cy.location("search").should(
          "include",
          "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=undispatched-umbrella,unscheduled,aborted,blocked&variant=%5Eubuntu1604%24"
        );
      });
    });

    describe("Build Variant Name", () => {
      it("Navigates to task tab and applies filters when clicking on build variant name", () => {
        // Clear filters persisting from last test
        cy.dataCy("clear-all-filters").click();

        // click on a different tab first, so that we aren't on the task tab initially
        cy.dataCy("changes-tab").first().click();
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "false");

        // clicking on build variant name should move to the task tab
        cy.dataCy("build-variant-display-name").first().click();
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");
        cy.location("search").should(
          "include",
          "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&variant=%5Eubuntu1604%24"
        );

        // Check that filter values have updated.
        cy.toggleTableFilter(4);
        cy.dataCy("variant-input-wrapper")
          .find("input")
          .should("have.value", "^ubuntu1604$");
      });

      it("Keeps sorts but not other filters when clicking on build variant name", () => {
        // Clear filters persisting from last test
        cy.dataCy("clear-all-filters").click();

        // Apply name filter
        cy.toggleTableFilter(1);
        cy.dataCy("taskname-input-wrapper")
          .find("input")
          .focus()
          .type("a-task-name")
          .type("{enter}");

        // name filter shouldn't be applied after clicking build variant name
        cy.dataCy("build-variant-display-name").first().click();
        cy.location("search").should(
          "include",
          "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&variant=%5Eubuntu1604%24"
        );
      });
    });
  });

  describe("Downstream Build Variants", () => {
    describe("Grouped Task Status Badge", () => {
      before(() => {
        cy.visit(versionRoute(versions[7]));
      });

      it("navigates to downstream tab when clicking grouped task status badge", () => {
        cy.dataCy("downstream-build-variants").within(() => {
          cy.dataCy("grouped-task-status-badge").first().click();
        });
        cy.dataCy("downstream-tasks-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");
        cy.location("pathname").should(
          "equal",
          "/version/5f74d99ab2373627c047c5e5/downstream-tasks"
        );
      });

      it("preserves other query params when clicking on grouped task status badge", () => {
        cy.dataCy("task-tab").first().click();
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");

        // Apply name filter
        cy.toggleTableFilter(1);
        cy.dataCy("taskname-input-wrapper")
          .find("input")
          .focus()
          .type("a-task-name")
          .type("{enter}");

        // name filter should still be applied after clicking task status badge
        cy.dataCy("downstream-build-variants").within(() => {
          cy.dataCy("grouped-task-status-badge").first().click();
        });
        cy.location("pathname").should(
          "equal",
          "/version/5f74d99ab2373627c047c5e5/downstream-tasks"
        );
        cy.location("search").should(
          "equal",
          "?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&taskName=a-task-name"
        );
      });
    });

    describe("Build Variant Name", () => {
      before(() => {
        cy.visit(versionRoute(versions[7]));
      });

      it("navigates to downstream tabs when clicking on build variant name", () => {
        cy.dataCy("downstream-build-variants").within(() => {
          cy.dataCy("build-variant-display-name").first().click();
        });
        cy.dataCy("downstream-tasks-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");
        cy.location("pathname").should(
          "equal",
          "/version/5f74d99ab2373627c047c5e5/downstream-tasks"
        );
      });

      it("preserves other query params when clicking on build variant name", () => {
        cy.dataCy("task-tab").first().click();
        cy.dataCy("task-tab")
          .should("have.attr", "aria-selected")
          .and("equal", "true");

        // Apply name filter
        cy.toggleTableFilter(1);
        cy.dataCy("taskname-input-wrapper")
          .find("input")
          .focus()
          .type("a-task-name")
          .type("{enter}");

        // name filter should still be applied after clicking build variant name
        cy.dataCy("downstream-build-variants").within(() => {
          cy.dataCy("build-variant-display-name").first().click();
        });
        cy.location("pathname").should(
          "equal",
          "/version/5f74d99ab2373627c047c5e5/downstream-tasks"
        );
        cy.location("search").should(
          "equal",
          "?page=0&sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&taskName=a-task-name"
        );
      });
    });
  });

  describe("Page title", () => {
    before(() => {
      cy.visit(versionRoute(versions[6]));
    });
    it("Should include a link to Jira", () => {
      cy.dataCy("page-title")
        .contains("a", "EVG-7425")
        .should(
          "have.attr",
          "href",
          "https://jira.example.com/browse/EVG-7425"
        );
    });

    it("Should include a link to GitHub", () => {
      cy.dataCy("page-title")
        .contains("a", "https://github.com/evergreen-ci/evergreen/pull/3186")
        .should(
          "have.attr",
          "href",
          "https://github.com/evergreen-ci/evergreen/pull/3186"
        );
    });
  });
});
