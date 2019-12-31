import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.css";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { introspectSchema, makeExecutableSchema } from "graphql-tools";
import { isDevelopment, isTest, getSchemaString, getGQLUrl } from "./utils";
import { printSchema } from "graphql/utilities/schemaPrinter";
import { SchemaLink } from "apollo-link-schema";
import Evergreen from "./components/app/App";
import gql from "graphql-tag";
import registerServiceWorker from "./registerServiceWorker";
import resolvers from "./gql/resolvers";

async function getClientLink() {
  const gqlURI = getGQLUrl();
  const httpLink = new HttpLink({
    uri: gqlURI
  });
  if (isDevelopment() || isTest()) {
    const schemaStr = getSchemaString();
    let executableSchema;
    try {
      executableSchema = makeExecutableSchema({
        typeDefs: schemaStr
          ? schemaStr
          : printSchema(await introspectSchema(httpLink)),
        resolvers
      });
    } catch (e) {
      console.log(
        "Unable to create local gql schema. Provide valid value for REACT_APP_GQL_URL or REACT_APP_SCHEMA_STRING environment variables",
        e
      );
      return null;
    }
    return new SchemaLink({ schema: executableSchema });
  } else {
    return httpLink;
  }
}

async function render() {
  const cache = new InMemoryCache();
  const link = await getClientLink();
  if (!link) {
    return;
  }
  const client = new ApolloClient({
    link,
    cache
  });
  client
    .query({
      query: gql`
        {
          userPatches(userId: "sam.kleinman") {
            id
            alias
          }
        }
      `
    })
    .then(result => console.log(result));

  ReactDOM.render(<Evergreen />, document.getElementById("root"));
}
render();
registerServiceWorker();
