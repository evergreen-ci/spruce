import { getClientLink } from "./GQLWrapper";
import SchemaLink from "apollo-link-schema";
import { HttpLink } from "apollo-link-http";
const schema = `
  type Patch {
    id: ID!
    description: String!
    project: String!
    githash: String!
    patchNumber: Int!
    author: String!
    version: String!
    status: String!
    createTime: Time!
    startTime: Time!
    finishTime: Time!
    variants: [String]!
    tasks: [String]!
    variantTasks: [VariantTask]!
    activated: Boolean!
    alias: String!
  }
  
  type Query {
    userPatches(userId: String!): [Patch]!
  }
  
  type StatusDetails {
    status: String!
    type: String!
    desc: String!
  }
  
  scalar Time
  
  type VariantTask {
    display_name: String!
    tasks: [String]!
  }
`;

describe("getClientLink when development mode is true", () => {
  it("should return a SchemaLink when passed a valid schema string that matches the resolvers", async () => {
    const client = await getClientLink({
      gqlURL: "",
      isDevelopment: true,
      isTest: false,
      schemaString: schema
    });
    expect(client).toBeInstanceOf(SchemaLink);
  });

  it("should return an HttpLink when passed an invalid schema string", async () => {
    const client = await getClientLink({
      gqlURL: "",
      isDevelopment: true,
      isTest: false,
      schemaString: ""
    });
    expect(client).toBeInstanceOf(HttpLink);
  });
});

describe("getClientLink when test mode is true", () => {
  it("should return a SchemaLink when passed a valid schema string that matches the resolvers", async () => {
    const client = await getClientLink({
      gqlURL: "",
      isDevelopment: true,
      isTest: true,
      schemaString: schema
    });
    expect(client).toBeInstanceOf(SchemaLink);
  });

  it("should return an HttpLink when passed an invalid schema string", async () => {
    const client = await getClientLink({
      gqlURL: "",
      isDevelopment: false,
      isTest: true,
      schemaString: ""
    });
    expect(client).toBeInstanceOf(HttpLink);
  });
});

describe("getClientLink when development and test mode are false", () => {
  it("should return an HttpLink", async () => {
    const client = await getClientLink({
      gqlURL: "",
      isDevelopment: false,
      isTest: false,
      schemaString: ""
    });
    expect(client).toBeInstanceOf(HttpLink);
  });
});
