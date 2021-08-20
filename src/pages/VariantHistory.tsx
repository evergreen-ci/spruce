import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";
import { TaskSelector } from "./variantHistory/TaskSelector";

export const VariantHistory = () => {
  const { projectId, variantName } = useParams<{
    projectId: string;
    variantName: string;
  }>();

  usePageTitle(`Variant History | ${projectId} | ${variantName}`);

  return (
    <PageWrapper>
      <H2>Build Variant: {variantName}</H2>
      <TaskSelector projectId={projectId} buildVariant={variantName} />
    </PageWrapper>
  );
};
