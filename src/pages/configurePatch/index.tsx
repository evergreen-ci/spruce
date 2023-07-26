import { useQuery } from "@apollo/client";
import { useParams, Navigate } from "react-router-dom";
import { ProjectBanner } from "components/Banners";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import { commitQueueAlias } from "constants/patch";
import { getVersionRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_CONFIGURE } from "gql/queries";
import { usePageTitle } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { validateObjectId } from "utils/validators";
import ConfigurePatchCore from "./configurePatchCore";

const ConfigurePatch: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatchToast = useToastContext();
  const { data, error, loading } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(GET_PATCH_CONFIGURE, {
    onError(err) {
      dispatchToast.error(err.message);
    },
    variables: { id },
  });

  const { patch } = data || {};
  usePageTitle(`Configure Patch`);

  // Can't configure a mainline version so should redirect to the version page
  if (!validateObjectId(id)) {
    return <Navigate to={getVersionRoute(id)} />;
  }

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error) {
    return <PageDoesNotExist />;
  }

  if (patch.alias === commitQueueAlias) {
    return <Navigate to={getVersionRoute(id)} />;
  }

  return (
    <PageWrapper>
      <ProjectBanner projectIdentifier={patch?.projectIdentifier} />
      <ConfigurePatchCore patch={patch} />
    </PageWrapper>
  );
};

export default ConfigurePatch;
