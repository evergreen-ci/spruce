import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_BARON } from "gql/queries";
import BuildBaronContent from "./BuildBaronContent";

interface Props {
  taskId: string;
  execution: number;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaron: React.VFC<Props> = ({
  taskId,
  execution,
  annotation,
  userCanModify,
}) => {
  const { data, loading } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    GET_BUILD_BARON,
    {
      variables: { taskId, execution },
    }
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
