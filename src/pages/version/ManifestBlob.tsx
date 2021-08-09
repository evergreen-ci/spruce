import { StyledLink } from "components/styles";
import { P2 } from "components/Typography";
import { string } from "utils";

const { omitTypename } = string;
// typescript interface with manifest that is an object of key-value pairs
interface Props {
  manifest: {
    id: string;
    revision: string;
    project: string;
    branch: string;
    isBase: boolean;
    moduleOverrides?: {
      [key: string]: string;
    };
    modules?: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
}

const ManifestBlob: React.FC<Props> = ({ manifest }) => {
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
