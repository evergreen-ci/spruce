/* eslint-disable no-console */
const { exec } = require("child_process");
const { getLatestCommitsSinceLastRelease } = require("./deploy-utils");

// this script gets the current user email, the latest git commit hash of
// the current branch and sends an email to a recipient that will forward
// the message to a slack channel
const sendEmail = async () =>
  exec("git config user.email", async (emailErr, email) => {
    if (emailErr) {
      console.error(errorMessage, emailErr);
    } else {
      const formattedEmail = email.trim();
      exec("git rev-parse HEAD", async (commitHashErr, commitHash) => {
        if (commitHashErr) {
          console.error(errorMessage, commitHashErr);
        } else {
          const formattedCommitHash = commitHash.substr(0, 9);
          const today = new Date();
          const day = prependZero(`${today.getDate()}`);
          const month = prependZero(`${today.getMonth() + 1}`);
          const dateStr = `${today.getFullYear()}/${month}/${day}`;
          const recipient = process.env.REACT_APP_DEPLOYS_EMAIL;
          const subject = `${dateStr} Spruce deploy ${formattedCommitHash}`;
          const messageBody = await getLatestCommitsSinceLastRelease();
          const formattedBody = messageBody.replace("\n", "<br />");
          exec(
            `evergreen notify email -f ${formattedEmail} -r ${recipient} -s "${subject}" -b "${formattedBody} <br/>Check it out <a href="${process.env.REACT_APP_SPRUCE_URL}">here!</a>"`,
            (notifyErr, notifyStdOut, notifyStdErr) => {
              if (notifyErr) {
                console.error(errorMessage, notifyErr);
              } else {
                console.log(notifyStdOut);
                console.log(notifyStdErr);
              }
            }
          );
        }
      });
    }
  });

sendEmail();

const errorMessage = "Error sending message to slack";
const prependZero = (strNum) => (strNum.length < 2 ? `0${strNum}` : strNum);
