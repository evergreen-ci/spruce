import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

export const VariantHistory = () => {
  const { projectId, variantId } = useParams<{
    projectId: string;
    variantId: string;
  }>();

  usePageTitle(`Variant History | ${projectId} | ${variantId}`);

  return (
    <PageWrapper>
      <H2>Build Variant: Code Health[code_health]</H2>
    </PageWrapper>
  );
};
