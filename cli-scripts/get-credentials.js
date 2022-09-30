const fs = require("fs/promises");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { program } = require("commander");
const { fromIni, fromEnv } = require("@aws-sdk/credential-providers");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

program
    .name("get-credentials")
    .option("-e, --env", "use credentials from the environment")
    .option("-l, --login-profile <name>", "AWS profile to use for logging in with SSO")
    .option("-p, --profile <name>", "AWS profile to use for accessing secrets manager")
    .option("-r, --region <region>", "AWS region containing the secret", "us-east-1")
    .requiredOption("-s, --secret-id <id>", "ID of the secret within AWS Secrets Manager");
program.parse();
const options = program.opts();

(async () => {
    try {
        const credentials = await getCredentials(options.env, options.loginProfile, options.profile)
        const secret = await getSecret(credentials, options.region, options.secretId);
        await writeCredentialsFile(secret);
        if (options.env !== true) {
            await awsLogout();
        }
    } catch (error) {
        console.log("Encountered error:")
        if ("message" in error) {
            console.log(error.message);
        }
        if ("error" in error) {
            console.log(error.error);
        }
    }
})();

async function getCredentials(env, loginProfile, profile) {
    if (env === true) {
        return fromEnv();
    }

    console.log("Signing in with AWS SSO");
    console.log("Click the allow button in the browser window to continue");
    try {
        var { stdout, stderr } = await exec(`aws sso login --profile ${loginProfile}`);
    } catch (error) {
        if (stdout !== undefined) {
            console.log(`stdout:\n${stdout}`);
        }
        if (stderr !== undefined) {
            console.log(`stderr:\n${stderr}`);
        }
        throw {
            message: "logging in with AWS SSO",
            error: error
        };
    }
    return fromIni({ profile: profile });
}

async function getSecret(credentials, region, secretId) {
    console.log("Retrieving secret from AWS");

    const smClient = new SecretsManagerClient({ credentials: credentials, region: region });
    try {
        var data = await smClient.send(new GetSecretValueCommand({ SecretId: secretId }));
    } catch (error) {
        throw {
            message: "fetching config file from AWS",
            error: error
        };
    }

    if (!("SecretString" in data)) {
        throw {
            message: `unexpected response from AWS:\n${data}`
        }
    }

    return data.SecretString;
}

async function writeCredentialsFile(secret) {
    try {
        var envFile = path.join(__dirname, "../env", ".cmdrc.json");
        await fs.writeFile(envFile, secret);
        console.log(`Wrote config file to ${envFile}`);
    } catch (error) {
        throw {
            message: `writing config file to ${envFile}`,
            error: error
        };
    }
}

async function awsLogout() {
    try {
        console.log("Logging out of AWS SSO session")
        var { stdout, stderr } = await exec("aws sso logout");
    } catch (error) {
        if (stdout !== undefined) {
            console.log(`stdout:\n${stdout}`);
        }
        if (stderr !== undefined) {
            console.log(`stderr:\n${stderr}`);
        }
        throw {
            message: "logging out from AWS SSO",
            error: error
        };
    }
}
