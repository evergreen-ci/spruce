import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  Combobox,
  ComboboxGroup,
  ComboboxOption,
} from "@leafygreen-ui/combobox";
import { useNavigate } from "react-router-dom";
import { getDistroSettingsRoute } from "constants/routes";
import { zIndex } from "constants/tokens";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";

interface DistroSelectProps {
  selectedDistro: string;
}

export const DistroSelect: React.FC<DistroSelectProps> = ({
  selectedDistro,
}) => {
  const navigate = useNavigate();

  const { data: distrosData, loading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(DISTROS, {
    variables: {
      onlySpawnable: false,
    },
  });

  const [adminOnly, nonAdminOnly] = useMemo(
    () => filterAdminOnlyDistros(distrosData?.distros ?? []),
    [distrosData?.distros],
  );

  return loading ? null : (
    <Combobox
      clearable={false}
      data-cy="distro-select"
      label="Distro"
      onChange={(value: string) => {
        navigate(getDistroSettingsRoute(value));
      }}
      popoverZIndex={zIndex.popover}
      value={selectedDistro}
    >
      {nonAdminOnly.map(({ name }) => (
        <ComboboxOption key={name} value={name}>
          {name}
        </ComboboxOption>
      ))}
      {adminOnly.length > 0 && (
        <ComboboxGroup label="Admin-Only">
          {adminOnly.map(({ name }) => (
            <ComboboxOption key={name} value={name}>
              {name}
            </ComboboxOption>
          ))}
        </ComboboxGroup>
      )}
    </Combobox>
  );
};

const filterAdminOnlyDistros = (distros: DistrosQuery["distros"]) =>
  distros.reduce(
    ([adminOnly, nonAdminOnly], distro) => {
      (distro.adminOnly ? adminOnly : nonAdminOnly).push(distro);
      return [adminOnly, nonAdminOnly];
    },
    [[], []],
  );
