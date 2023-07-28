import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { GET_DISTROS } from "gql/queries";

interface DistroSelectProps {
  getRoute: (distroId: string) => string;
  selectedDistro: string;
}

export const DistroSelect: React.VFC<DistroSelectProps> = ({
  getRoute,
  selectedDistro,
}) => {
  const navigate = useNavigate();

  const { data: distrosData, loading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: false,
    },
  });
  const { distros = [] } = distrosData || {};

  return loading ? null : (
    <SearchableDropdown
      label="Distro"
      value={selectedDistro}
      options={distros.map((d) => d.name)}
      onChange={(distroId: string) => {
        navigate(getRoute(distroId));
      }}
      valuePlaceholder="Select a distro"
      data-cy="distro-select"
    />
  );
};
