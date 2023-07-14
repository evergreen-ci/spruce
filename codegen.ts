import type { CodegenConfig } from "@graphql-codegen/cli";
import path from "path";

export const getConfig = ({
  schema,
  generatedFileName,
}: {
  schema: string;
  generatedFileName: string;
}): CodegenConfig => ({
  schema,
  documents: ["./src/**/*.ts", "./src/**/*.graphql", "./src/**/*.gql"].map(
    (d) => path.resolve(__dirname, d)
  ),
  hooks: {
    afterAllFileWrite: [
      `${path.resolve(__dirname, "./node_modules/.bin/prettier")} --write`,
    ],
  },
  overwrite: true,
  generates: {
    [generatedFileName]: {
      plugins: ["typescript", "typescript-operations"],
      config: {
        preResolveTypes: true,
        arrayInputCoercion: false,
        scalars: {
          StringMap: "{ [key: string]: any }",
          Time: "Date",
          Duration: "number",
        },
      },
    },
  },
});

export const generatedFileName = path.resolve(
  __dirname,
  "./src/gql/generated/types.ts"
);

export default getConfig({
  schema: "sdlschema/**/*.graphql",
  generatedFileName,
});
