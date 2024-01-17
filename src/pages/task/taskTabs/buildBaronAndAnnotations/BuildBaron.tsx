import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON } from "gql/queries";
import BuildBaronContent from "./BuildBaronContent";

interface Props {
  taskId: string;
  execution: number;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaron: React.FC<Props> = ({
  annotation,
  execution,
  taskId,
  userCanModify,
}) => {
  const { data, loading } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId, execution },
    },
  );
  return (
    <>
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {(data || annotation) && (
        <BuildBaronContent
          bbData={data?.buildBaron}
          taskId={taskId}
          execution={execution}
          loading={loading}
          annotation={annotation}
          userCanModify={userCanModify}
        />
      )}
    </>
  );
};

export default BuildBaron;
