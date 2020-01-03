import { getClientLink, getGQLClient } from "./GQLWrapper";
import SchemaLink from "apollo-link-schema";
import { HttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";

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
    const link = await getClientLink({
      gqlURL: "",
      isDevelopment: true,
      isTest: false,
      schemaString: schema
    });
    expect(link).toBeInstanceOf(SchemaLink);
  });

  it("should return an HttpLink when passed an invalid schema string", async () => {
    const link = await getClientLink({
      gqlURL: "",
      isDevelopment: true,
      isTest: false,
      schemaString: ""
    });
    expect(link).toBeInstanceOf(HttpLink);
  });
});

describe("getClientLink when test mode is true", () => {
  it("should return a SchemaLink when passed a valid schema string that matches the resolvers", async () => {
    const link = await getClientLink({
      gqlURL: "",
      isDevelopment: false,
      isTest: true,
      schemaString: schema
    });
    expect(link).toBeInstanceOf(SchemaLink);
  });

  it("should return an HttpLink when passed an invalid schema string", async () => {
    const link = await getClientLink({
      gqlURL: "",
      isDevelopment: false,
      isTest: true,
      schemaString: ""
    });
    expect(link).toBeInstanceOf(HttpLink);
  });
});

describe("getClientLink when development and test mode are false", () => {
  it("should return an HttpLink", async () => {
    const link = await getClientLink({
      gqlURL: "",
      isDevelopment: false,
      isTest: false,
      schemaString: ""
    });
    expect(link).toBeInstanceOf(HttpLink);
  });
});

describe("getGQLClient", () => {
  it("should return a client if params are provided", async () => {
    const client = await getGQLClient({
      isTest: false,
      isDevelopment: false,
      schemaString: "",
      gqlURL: ""
    });
    expect(client).toBeInstanceOf(ApolloClient);
  });

  it("should return a client if no params are provided", async () => {
    const client = await getGQLClient({});
    expect(client).toBeInstanceOf(ApolloClient);
  });
});
