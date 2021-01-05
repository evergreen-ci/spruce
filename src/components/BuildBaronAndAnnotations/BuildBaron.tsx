import React from "react";
import { ApolloError } from "@apollo/client";
import { Skeleton } from "antd";
import { Annotation, BuildBaronQuery } from "gql/generated/types";
import { BuildBaronContent } from "./BuildBaronContent";

interface Props {
  bbData: BuildBaronQuery;
  error: ApolloError;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userModifyPermission: boolean;
}

const BuildBaron: React.FC<Props> = ({
  bbData,
  error,
  taskId,
  execution,
  loading,
  annotation,
  userModifyPermission,
}) => (
  <>
    {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
    {error && (
      <div data-cy="bb-error">
        There was an error loading the build baron: {error.message}
      </div>
    )}

    {bbData && (
      <BuildBaronContent
        bbData={bbData.buildBaron}
        taskId={taskId}
        execution={execution}
        loading={loading}
        annotation={annotation}
        userModifyPermission={userModifyPermission}
      />
    )}
  </>
);

export default BuildBaron;
