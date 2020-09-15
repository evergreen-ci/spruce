import React from "react";
import { ApolloError } from "@apollo/client";
import { BuildBaronQuery } from "gql/generated/types";
import { BuildBaronTable } from "pages/task/BuildBaronTable";

interface Props {
  data: BuildBaronQuery;
  timeZone: string;
  error: ApolloError;
}

export const BuildBaron: React.FC<Props> = ({ data, timeZone, error }) => (
  <>
    {error && (
      <div>There was an error loading the build baron: {error.message}</div>
    )}

    {data && (
      <BuildBaronTable eventData={data.buildBaron} timeZone={timeZone} />
    )}
  </>
);
