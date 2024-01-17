import type { CodegenConfig } from "@graphql-codegen/cli";
import path from "path";

export const getConfig = ({
  generatedFileName,
  silent,
}: {
  generatedFileName: string;
} & Pick<CodegenConfig, "silent">): CodegenConfig => ({
  documents: ["./src/**/*.ts", "./src/**/*.graphql", "./src/**/*.gql"].map(
    (d) => path.resolve(__dirname, d),
  ),
  generates: {
    [generatedFileName]: {
      config: {
        arrayInputCoercion: false,
        preResolveTypes: true,
        scalars: {
          Duration: "number",
          StringMap: "{ [key: string]: any }",
          Time: "Date",
        },
      },
      plugins: ["typescript", "typescript-operations"],
    },
  },
  hooks: {
    afterAllFileWrite: [
      `${path.resolve(__dirname, "./node_modules/.bin/prettier")} --write`,
    ],
  },
  overwrite: true,
  schema: "sdlschema/**/*.graphql",
  silent,
});

export const generatedFileName = path.resolve(
  __dirname,
  "./src/gql/generated/types.ts",
);

export default getConfig({
  generatedFileName,
});
