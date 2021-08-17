import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";

const { gray } = uiColors;

interface Props {
  buildVariantDisplayName: string;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
}) => <Label key={buildVariantDisplayName}>{buildVariantDisplayName}</Label>;

const Label = styled(Body)`
  margin-top: 20px;
  color: ${gray.dark2};
  font-size: 14px;
  width: 124px;
  word-break: break-word;
`;
