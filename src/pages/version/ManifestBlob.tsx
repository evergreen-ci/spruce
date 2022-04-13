import { StyledLink } from "components/styles";
import { P2 } from "components/Typography";
import { Manifest } from "gql/generated/types";
import { string } from "utils";

const { omitTypename } = string;

interface Props {
  manifest: Manifest;
}

const ManifestBlob: React.VFC<Props> = ({ manifest }) => {
  const cleanedManifest = omitTypename(manifest);
  const blob = new Blob([JSON.stringify(cleanedManifest, null, 3)], {
    type: "text/json",
  });
  return (
    <P2>
      <StyledLink
        data-cy="manifest-link"
        href={URL.createObjectURL(blob)}
        target="__blank"
      >
        Version Manifest
      </StyledLink>
    </P2>
  );
};

export default ManifestBlob;
