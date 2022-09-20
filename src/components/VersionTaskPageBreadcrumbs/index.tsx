import styled from "@emotion/styled";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { size } from "constants/tokens";
import { useBreadcrumbRoot, useBreadcrumbVersion } from "hooks";

interface Props {
  taskName?: string;
  patchNumber?: number;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
  };
}

const VersionTaskPageBreadcrumbs: React.VFC<Props> = ({
  versionMetadata,
  patchNumber,
  taskName,
}) => {
  const { isPatch, author, projectIdentifier } = versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbVersion = useBreadcrumbVersion(versionMetadata, patchNumber);

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    breadcrumbVersion,
    ...(taskName ? [{ text: taskName }] : []),
  ];

  return (
    <Container>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.s};
`;
export default VersionTaskPageBreadcrumbs;
