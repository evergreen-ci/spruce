import React from "react";
import { ApolloError } from "@apollo/client";
import { Skeleton } from "antd";
import { BuildBaronQuery } from "gql/generated/types";
import { BuildBaronContent } from "./BuildBaronContent";

interface Props {
  data: BuildBaronQuery;
  error: ApolloError;
  taskId: string;
  loading: boolean;
}

const BuildBaron: React.FC<Props> = ({ data, error, taskId, loading }) => (
  <>
    {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
    {error && (
      <div>There was an error loading the build baron: {error.message}</div>
    )}

    {data && (
      <BuildBaronContent
        eventData={data.buildBaron}
        taskId={taskId}
        loading={loading}
      />
    )}
  </>
);

export default BuildBaron;
