/* eslint-disable no-console */
const { execSync } = require("child_process");
const { getLatestCommitsSinceLastRelease } = require("./deploy-utils");

// this script gets the current user email, the latest git commit hash of
// the current branch and sends an email to a recipient that will forward
// the message to a slack channel
const sendEmail = async () => {
  try {
    const email = await execSync("git config user.email", {
      encoding: "utf8",
    });
    const formattedEmail = email.trim();
    const commitHash = await execSync("git rev-parse HEAD", {
      encoding: "utf8",
    });

    const formattedCommitHash = commitHash.substr(0, 9);
    const today = new Date();
    const day = prependZero(`${today.getDate()}`);
    const month = prependZero(`${today.getMonth() + 1}`);
    const dateStr = `${today.getFullYear()}/${month}/${day}`;
    const recipient = process.env.REACT_APP_DEPLOYS_EMAIL;

    const subject = `${dateStr} Spruce deploy to ${formattedCommitHash}`;
    const messageBody = await getLatestCommitsSinceLastRelease();
    const formattedBody = messageBody.replaceAll("\n", "<br/>");

    const emailNotification = await execSync(
      `evergreen notify email -f ${formattedEmail} -r ${recipient} -s "${subject}" -b "${formattedBody} <br/>Check it out <a href="${process.env.REACT_APP_SPRUCE_URL}">here!</a>"`,
      {
        encoding: "utf8",
      }
    );
    console.log(emailNotification);
    console.log(`Email sent to ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${formattedBody}`);
  } catch (err) {
    console.error("Encountered an error when sending the commit email: ");
    console.error(err);
  }
};

sendEmail();
const prependZero = (strNum) => (strNum.length < 2 ? `0${strNum}` : strNum);
