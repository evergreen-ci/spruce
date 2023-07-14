import fs from "fs";
import https from "https";
import os from "os";
import path from "path";
import { generate } from "@graphql-codegen/cli";
import {
  getConfig,
  generatedFileName as localGeneratedTypesFileName,
} from "../codegen";

const GITHUB_API = "https://api.github.com";
const INITIAL_PATH = "graphql/schema";
const REPO = "/repos/evergreen-ci/evergreen/contents/";
const USER_AGENT = "Mozilla/5.0";

const downloadFile = (url: string, savePath: string) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const writeStream = fs.createWriteStream(savePath);
        res.pipe(writeStream);

        writeStream.on("finish", () => {
          writeStream.close();
          resolve(true);
        });

        writeStream.on("error", reject);
      })
      .on("error", reject);
  });

const fetchAndDownloadFiles = (repoPath: string, localPath: string) =>
  new Promise((resolve, reject) => {
    https
      .get(
        `${GITHUB_API}${repoPath}`,
        {
          headers: {
            "User-Agent": USER_AGENT,
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", async () => {
            const files = JSON.parse(data);
            const promises = files.map((file) => {
              const fileSavePath = path.join(localPath, file.name);
              if (file.type === "file") {
                return downloadFile(file.download_url, fileSavePath);
              } else if (file.type === "dir") {
                if (!fs.existsSync(fileSavePath)) {
                  fs.mkdirSync(fileSavePath, { recursive: true });
                }
                return fetchAndDownloadFiles(
                  `${REPO}${file.path}`,
                  fileSavePath
                );
              }
            });

            try {
              await Promise.all(promises);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          });

          res.on("error", reject);
        }
      )
      .on("error", reject);
  });

const downloadAndGenerate = async () => {
  const tempDir = os.tmpdir();
  fs.mkdirSync(tempDir, { recursive: true });
  await fetchAndDownloadFiles(
    path.join(REPO, INITIAL_PATH),
    path.join(tempDir, INITIAL_PATH)
  );
  const latestGeneratedTypesFileName = `${tempDir}/types.ts`;
  await generate(
    getConfig({
      schema: `${tempDir}/${INITIAL_PATH}/**/*.graphql`,
      generatedFileName: latestGeneratedTypesFileName,
    }),
    true
  );
  return latestGeneratedTypesFileName;
};

const diffTypes = async () => {
  try {
    const latestGeneratedTypesFileName = await downloadAndGenerate();
    [latestGeneratedTypesFileName, localGeneratedTypesFileName].forEach(
      (fileName) => {
        if (!fs.existsSync(fileName)) {
          console.error(
            `Types file located at ${fileName} does not exist. Validation failed.`
          );
          process.exit(1);
        }
      }
    );
    const localGeneratedTypesFileContents = fs.readFileSync(
      localGeneratedTypesFileName
    );
    const latestGeneratedTypesFileContents = fs.readFileSync(
      latestGeneratedTypesFileName
    );
    if (
      !localGeneratedTypesFileContents.equals(latestGeneratedTypesFileContents)
    ) {
      console.error(
        "The codegen task will fail in CI. Run 'yarn codegen' against the latest Evergreen code."
      );
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (e) {
    console.error(
      `An issue occured validating the generated GQL types file: ${e}`
    );
    process.exit(1);
  }
};

diffTypes();
