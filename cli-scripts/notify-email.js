const { exec } = require("child_process");
const simpleGit = require("simple-git");
const { gitDescribeSync } = require("git-describe");
const path = require("path");

const git = simpleGit(path.resolve(__dirname, ".."));

// this script gets the current user email, the latest git commit hash of
// the current branch and sends an email to a recipient that will forward
// the message to a slack channel
const sendEmail = () =>
  exec("git config user.email", async (emailErr, email) => {
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
          getLatestCommitsSinceLastRelease().then((messageBody) => {
            const cleanedMessageBody = messageBody
              .replace(/\(/gm, "/(")
              .replace(/\)/gm, "/)");
            exec(
              `evergreen notify email -f ${formattedEmail} -r ${recipient} -s "${subject}" -b "${cleanedMessageBody} check it out <a href="${process.env.REACT_APP_SITE_URL}">here</a>"`,
              (notifyErr, notifyStdOut, notifyStdErr) => {
                if (notifyErr) {
                  console.error(errorMessage, notifyErr);
                } else {
                  console.log(notifyStdOut);
                  console.log(notifyStdErr);
                }
              }
            );
          });
        }
      });
    }
  });

// Fetches all the commits since the last release tag if there are no commits
// since the last release it returns a message otherwise it returns all the commits
const getLatestCommitsSinceLastRelease = async () => {
  const latestRelease = gitDescribeSync(__dirname);
  const latestCommits = await git.log(latestRelease.tag, "HEAD");
  if (latestCommits.all.length === 0) {
    return "No Changes found since last release\n";
  }
  return prettifyCommitLogs(latestCommits.all);
};

// Returns all the commits formatted
const prettifyCommitLogs = (latestCommits) => {
  let commitBody = "<u><i>Changes since last release</i></u><br>";
  latestCommits.forEach((commit) => {
    let commitString = "";
    commitString += `hash: <b>${commit.hash}</b><br>`;
    commitString += `author: <b>${commit.author_name}</b><br>`;
    commitString += `change: <b>${commit.message}</b><br>`;
    commitString += "<br>";
    commitBody += commitString;
  });
  return commitBody;
};

sendEmail();

const errorMessage = "Error sending message to slack";
const lineBreakRegex = /(\r\n|\n|\r)/gm;
const prependZero = (strNum) => (strNum.length < 2 ? `0${strNum}` : strNum);
