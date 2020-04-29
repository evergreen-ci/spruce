module.exports = {
  schema: "sdlschema.graphql",
  documents: ["./src/**/*.ts"],
  overwrite: true,
  generates: {
    "./src/gql/generated/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        skipTypename: true,
        preResolveTypes: true,
        scalars: {
          StringMap: "{ [key: string]: any }",
          Time: "Date",
          Duration: "number",
        },
      },
    },
  },
};
