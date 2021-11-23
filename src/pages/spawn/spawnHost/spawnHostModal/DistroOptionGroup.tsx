import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body, Overline } from "@leafygreen-ui/typography";

const { gray } = uiColors;

interface OptionGroupProps {
  label: string;
  options: string[];
  onClick: (value: string) => void;
}
export const DistroOptionGroup: React.FC<OptionGroupProps> = ({
  label,
  options,
  onClick,
}) => (
  <OptionGroupContainer>
    <Overline>{label}</Overline>
    <ListContainer>
      {options?.map((o) => (
        <ProjectContainer key={`distro_${o}`} onClick={() => onClick(o)}>
          <Body>{o}</Body>
        </ProjectContainer>
      ))}
    </ListContainer>
  </OptionGroupContainer>
);

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;

const ProjectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 12px;
  :hover {
    background-color: ${gray.light1};
  }
`;

const OptionGroupContainer = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
