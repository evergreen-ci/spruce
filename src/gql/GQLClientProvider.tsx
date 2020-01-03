import * as React from "react";
import GQLWrapper from "./GQLWrapper";
import { getGQLUrl, isDevelopment, isTest, getSchemaString } from "../utils";

export const GQLClientProvider = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <GQLWrapper
    gqlURL={getGQLUrl()}
    isDevelopment={isDevelopment()}
    isTest={isTest()}
    schemaString={getSchemaString()}
  >
    {children}
  </GQLWrapper>
);

export default GQLClientProvider;
