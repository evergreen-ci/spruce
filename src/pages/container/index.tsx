import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PageTitle } from "components/PageTitle";
import PodStatusBadge from "components/PodStatusBadge";
import {
  PageLayout,
  PageSider,
  PageWrapper,
  PageContent,
} from "components/styles";
import { useToastContext } from "context/toast";
import { PodQuery, PodQueryVariables } from "gql/generated/types";
import { GET_POD } from "gql/queries";
import { PodStatus } from "types/pod";
import EventsTable from "./EventsTable";
import Metadata from "./Metadata";

const Container = () => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PodQuery, PodQueryVariables>(
    GET_POD,
    {
      variables: { podId: id },
      onError: (err) => {
        dispatchToast.error(
          `There was an error loading the host: ${err.message}`
        );
      },
    }
  );
  const { pod } = data || {};
  const { id: podId, status } = pod || {};
  return (
    <PageWrapper data-cy="host-page">
      <PageTitle
        title={`Container: ${podId}`}
        pageTitle={`Container: ${podId}`}
        size="large"
        loading={loading}
        badge={<PodStatusBadge status={status as PodStatus} />}
      />
      <PageLayout>
        <PageSider width={350}>
          <Metadata loading={loading} pod={pod} error={error} />
        </PageSider>
        <PageLayout>
          <PageContent>
            <EventsTable />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
export default Container;
