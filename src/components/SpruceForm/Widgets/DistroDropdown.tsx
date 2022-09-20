import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import SearchableDropdown, {
  SearchableDropdownProps,
} from "components/SearchableDropdown";
import { size } from "constants/tokens";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

interface DistroValue {
  value: string;
  isVirtualWorkstation: boolean;
}
interface OptionValue {
  title: string;
  distros: DistroValue[];
}
const Dropdown = SearchableDropdown<OptionValue>;
interface DistroEnum {
  options: {
    enumOptions: Array<{
      schema: {
        isVirtualWorkstation: boolean;
      };
      label: string;
      value: string;
    }>;
  };
}

export const SearchableDistroDropdownWidget: React.VFC<
  DistroEnum &
    SpruceWidgetProps & {
      options: Pick<SearchableDropdownProps<string>, "data-cy">;
    }
> = ({ options, label, onChange, ...rest }) => {
  const {
    ariaLabelledBy,
    "data-cy": dataCy,
    enumOptions,
    marginBottom,
    elementWrapperCSS,
  } = options;

  const searchableOptions = enumOptions.reduce<Array<OptionValue>>(
    (accum, { schema, value }) => {
      const { isVirtualWorkstation } = schema;
      accum[isVirtualWorkstation ? 0 : 1].distros.push({
        value,
        isVirtualWorkstation,
      });
      return accum;
    },
    [
      { title: "Workstation distros", distros: [] },
      { title: "Other distros", distros: [] },
    ]
  );
  const selectedDistro = rest.value?.value;
  return (
    <StyledElementWrapper css={elementWrapperCSS} marginBottom={marginBottom}>
      <Dropdown
        valuePlaceholder={selectedDistro || "Select a distro"}
        label={ariaLabelledBy ? undefined : label}
        value={selectedDistro}
        data-cy={dataCy}
        onChange={onChange}
        options={searchableOptions}
        searchFunc={(items, match) =>
          items.map((e) => ({
            ...e,
            distros: e.distros.filter(({ value }) =>
              value.toLowerCase().includes(match.toLowerCase())
            ),
          }))
        }
        optionRenderer={({ title, distros }, onClick) => (
          <DropdownOption onClick={onClick} title={title} distros={distros} />
        )}
      />
    </StyledElementWrapper>
  );
};

const DropdownOption: React.VFC<{
  title: string;
  distros: DistroValue[];
  onClick: (distro: DistroValue) => void;
}> = ({ title, distros, onClick }) => (
  <OptionContainer key={title}>
    <Overline>{title}</Overline>
    <ListContainer>
      {distros?.map((d) => (
        <Option
          onClick={() => onClick(d)}
          key={d.value}
          data-cy={`distro-option-${d.value}`}
        >
          {d.value}
        </Option>
      ))}
    </ListContainer>
  </OptionContainer>
);
const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;
const OptionContainer = styled.div`
  padding: ${size.xs};
`;
const Option = styled(OptionContainer)`
  word-break: break-word;
  cursor: pointer;
  :hover {
    background-color: ${uiColors.gray.light1};
  }
`;
const StyledElementWrapper = styled(ElementWrapper)`
  display: flex;
  flex-direction: column;
`;
