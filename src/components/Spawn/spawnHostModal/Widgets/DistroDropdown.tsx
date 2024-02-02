import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import SearchableDropdown, {
  SearchableDropdownProps,
} from "components/SearchableDropdown";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { SpruceWidgetProps } from "components/SpruceForm/Widgets/types";
import { size } from "constants/tokens";

const { gray } = palette;

interface DistroValue {
  value: string;
  isVirtualWorkstation: boolean;
}
interface OptionValue {
  title: string;
  distros: DistroValue[];
}

interface DistroEnum {
  options: {
    enumOptions: Array<{
      schema: {
        adminOnly: boolean;
        isVirtualWorkstation: boolean;
      };
      label: string;
      value: string;
    }>;
  };
}

export const DistroDropdown: React.FC<
  DistroEnum &
    SpruceWidgetProps & {
      options: Pick<SearchableDropdownProps<string>, "data-cy">;
    }
> = ({ label, onChange, options, ...rest }) => {
  const {
    ariaLabelledBy,
    "data-cy": dataCy,
    elementWrapperCSS,
    enumOptions,
  } = options;

  const searchableOptions = categorizeDistros(enumOptions);
  const selectedDistro = rest.value?.value;
  return (
    <StyledElementWrapper css={elementWrapperCSS}>
      <SearchableDropdown
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
              value.toLowerCase().includes(match.toLowerCase()),
            ),
          }))
        }
        optionRenderer={({ distros, title }, onClick) => (
          <DropdownOption
            key={title}
            onClick={onClick}
            title={title}
            distros={distros}
          />
        )}
      />
    </StyledElementWrapper>
  );
};

// Bucketize distros into admin-only, workstation, and Non-Workstation buckets. Admin-only takes precedence over workstation.
const categorizeDistros = (distros: DistroEnum["options"]["enumOptions"]) =>
  distros.reduce<OptionValue[]>(
    (accum, { schema, value }) => {
      const { adminOnly, isVirtualWorkstation } = schema;

      // Default to standard distro
      let categoryIndex = 1;
      if (adminOnly) {
        categoryIndex = 2;
      } else if (isVirtualWorkstation) {
        categoryIndex = 0;
      }

      accum[categoryIndex].distros.push({ value, isVirtualWorkstation });

      return accum;
    },
    [
      { title: "Workstation distros", distros: [] },
      { title: "Other distros", distros: [] },
      { title: "Admin-only distros", distros: [] },
    ],
  );

const DropdownOption: React.FC<{
  title: string;
  distros: DistroValue[];
  onClick: (distro: DistroValue) => void;
}> = ({ distros, onClick, title }) =>
  distros.length > 0 ? (
    <OptionContainer key={title}>
      <Overline>{title}</Overline>
      <ListContainer>
        {distros.map((d) => (
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
  ) : null;

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;
const OptionContainer = styled.div`
  padding: ${size.xs};
`;
const Option = styled(OptionContainer)`
  word-break: normal;
  overflow-wrap: anywhere;
  cursor: pointer;
  :hover {
    background-color: ${gray.light1};
  }
`;
const StyledElementWrapper = styled(ElementWrapper)`
  display: flex;
  flex-direction: column;
`;
