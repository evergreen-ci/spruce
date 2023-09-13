import { useRef } from "react";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table/new";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { BaseTable } from "./BaseTable";

export default {
  component: BaseTable,
} satisfies CustomMeta<typeof BaseTable>;

export const Default: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={fullArray} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const EmptyState: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={[]} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};
interface DataShape {
  name: string;
  column1: string;
  column2: string;
}
const fullArray: DataShape[] = Array.from({ length: 100 }, (_, i) => ({
  name: `name ${i}`,
  column1: `column1 ${i}`,
  column2: `column2 ${i}`,
}));
const columns: LGColumnDef<DataShape>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 60,
    enableSorting: true,
  },
  {
    accessorKey: "column1",
    header: "Column 1",
    size: 60,
    enableSorting: true,
  },
  {
    accessorKey: "column2",
    header: "Column 2",
    size: 60,
    enableSorting: true,
  },
];

const TemplateComponent: React.FC<
  React.ComponentProps<typeof BaseTable> & {
    data: DataShape[];
  }
> = (args) => {
  const { data, ...rest } = args;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useLeafyGreenTable<DataShape>({
    data,
    columns,
    containerRef: tableContainerRef,
  });

  return <BaseTable {...rest} table={table} />;
};
