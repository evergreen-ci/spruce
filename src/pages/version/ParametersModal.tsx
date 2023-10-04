import { useRef, useState } from "react";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table/new";
import { DisplayModal } from "components/DisplayModal";
import { MetadataItem } from "components/MetadataCard";
import { StyledLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { Parameter } from "gql/generated/types";

interface ParametersProps {
  parameters: Parameter[];
}

export const ParametersModal: React.FC<ParametersProps> = ({ parameters }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useLeafyGreenTable<Parameter>({
    containerRef: tableContainerRef,
    data: parameters,
    columns,
  });

  return (
    <>
      {parameters !== undefined && parameters.length > 0 && (
        <MetadataItem>
          <StyledLink
            data-cy="parameters-link"
            onClick={() => setShowModal(true)}
          >
            Patch Parameters
          </StyledLink>
        </MetadataItem>
      )}
      <DisplayModal
        data-cy="parameters-modal"
        open={showModal}
        setOpen={setShowModal}
        size="large"
        title="Patch Parameters"
      >
        <BaseTable table={table} />
      </DisplayModal>
    </>
  );
};

const columns: LGColumnDef<Parameter>[] = [
  {
    accessorKey: "key",
    header: "Key",
    cell: (value) => value.getValue(),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: (value) => value.getValue(),
  },
];
