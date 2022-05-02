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
  userCanModify: boolean;
}

const BuildBaron: React.VFC<Props> = ({
  bbData,
  error,
  taskId,
  execution,
  loading,
  annotation,
  userCanModify,
}) => (
  <>
    {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
    {error && (
      <div data-cy="bb-error">
        There was an error loading the build baron: {error.message}
      </div>
    )}

    {(bbData || annotation) && (
      <BuildBaronContent
        bbData={bbData?.buildBaron}
        taskId={taskId}
        execution={execution}
        loading={loading}
        annotation={annotation}
        userCanModify={userCanModify}
      />
    )}
  </>
);

export default BuildBaron;
