import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.css";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { GraphQLSchema } from "graphql/type";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { introspectSchema, makeExecutableSchema } from "graphql-tools";
import { isDevelopment, isTest, getSchemaString, getGQLUrl } from "./utils";
import { printSchema } from "graphql/utilities/schemaPrinter";
import { SchemaLink } from "apollo-link-schema";
import Evergreen from "./components/app/App";
import registerServiceWorker from "./registerServiceWorker";
import resolvers from "./gql/resolvers";

async function getClientLink(): Promise<HttpLink | SchemaLink | null> {
  const gqlURI: string = getGQLUrl();
  const httpLink: HttpLink = new HttpLink({
    uri: gqlURI
  });
  if (isDevelopment() || isTest()) {
    const schemaStr: string = getSchemaString();
    let executableSchema: GraphQLSchema | null = null;
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
  const cache: InMemoryCache = new InMemoryCache();
  const link: HttpLink | SchemaLink = await getClientLink();
  const client: ApolloClient<NormalizedCacheObject> = link
    ? new ApolloClient({
        link,
        cache
      })
    : null;
  const App: JSX.Element = client ? (
    <ApolloProvider client={client}>
      <Evergreen />
    </ApolloProvider>
  ) : (
    <Evergreen />
  );
  ReactDOM.render(App, document.getElementById("root"));
}
render();
registerServiceWorker();
