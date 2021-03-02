import { popconfirmYesClassName } from "../../utils/popconfirm";

const slackNotificationBanner = "slack-notification-banner";
const slackUsername = "username";

describe("Slack notification banner", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });
  afterEach(() => {
    cy.clearCookies();
  });
  it("shows up across the app if user has not set slack notification settings", () => {
    cy.dataCy(slackNotificationBanner).should("exist");

    cy.visit("/version/5ecedafb562343215a7ff297/tasks");
    cy.dataCy(slackNotificationBanner).should("exist");

    cy.visit(
      "/task/evergreen_ubuntu1604_dist_patch_33016573166a36bd5f46b4111151899d5c4e95b1_5ecedafb562343215a7ff297_20_05_27_21_39_46/logs?execution=1"
    );
    cy.dataCy(slackNotificationBanner).should("exist");
  });

  it("does not show up again if user closes the banner", () => {
    cy.dataCy(slackNotificationBanner).within(() =>
      cy.get("[aria-label='X Icon']").click()
    );
    cy.dataCy(slackNotificationBanner).should("not.exist");

    cy.visit("/version/5ecedafb562343215a7ff297/tasks");
    cy.dataCy(slackNotificationBanner).should("not.exist");
  });

  it("does not show up after user has entered their username and clicks 'save'", () => {
    cy.dataCy("subscribe-to-notifications").click();
    cy.dataCy("slack-username-input").type(slackUsername);
    cy.get(popconfirmYesClassName).click();

    cy.dataCy(slackNotificationBanner).should("not.exist");
    cy.dataCy("toast").contains(
      "You will now receive Slack notifications when your patches fail or succeed"
    );
  });

  it("new settings are reflected in user preferences", () => {
    cy.visit("/preferences/notifications");
    cy.dataCy("slack-username-field").should("contain.value", slackUsername);
    cy.get('input[value="slack"]').should("be.checked");
  });
});
