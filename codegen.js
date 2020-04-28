module.exports = {
  schema: [
    {
      "http://localhost:9090/graphql/query": {
        headers: {
          cookie: process.env.REACT_APP_GQL_COOKIE,
        },
      },
    },
  ],
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
