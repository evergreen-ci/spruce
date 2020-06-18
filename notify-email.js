const { exec } = require("child_process");
// this script gets the current user email, the latest git commit hash of
// the current branch and sends an email to a recipient that will forward
// the message to a slack channel
const postToSlack = () =>
  exec("git config user.email", (emailErr, email) => {
    if (emailErr) {
      console.error(errorMessage, emailErr);
    } else {
      const formattedEmail = email.replace(lineBreakRegex, "");
      exec("git rev-parse HEAD", (commitHashErr, commitHash) => {
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
          exec(
            `evergreen notify email -f ${formattedEmail} -r ${recipient} -s "${subject}" -b "check it out <a href="${process.env.REACT_APP_SITE_URL}">here</a>"`,
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

postToSlack();

const errorMessage = "Error sending message to slack";
const lineBreakRegex = /(\r\n|\n|\r)/gm;
const prependZero = (strNum) => (strNum.length < 2 ? `0${strNum}` : strNum);
