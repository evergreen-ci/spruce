import { MetadataItem } from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { Manifest } from "gql/generated/types";
import { string } from "utils";

const { omitTypename } = string;

interface Props {
  manifest: Manifest;
}

const ManifestBlob: React.FC<Props> = ({ manifest }) => {
  const cleanedManifest = omitTypename(manifest);
  const blob = new Blob([JSON.stringify(cleanedManifest, null, 3)], {
    type: "text/json",
  });
  return (
    <MetadataItem>
      <StyledLink
        data-cy="manifest-link"
        href={URL.createObjectURL(blob)}
        target="__blank"
      >
        Version Manifest
      </StyledLink>
    </MetadataItem>
  );
};

export default ManifestBlob;
