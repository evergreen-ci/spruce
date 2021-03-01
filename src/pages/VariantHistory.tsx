import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

export const VariantHistory = () => {
  const { projectId, variantId } = useParams<{
    projectId: string;
    variantId: string;
  }>();

  usePageTitle(`Variant History | ${projectId} | ${variantId}`);

  return <PageWrapper>The Future home of the Variant History page</PageWrapper>;
};
