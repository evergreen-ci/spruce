import { useRef } from "react";
import { LGColumnDef, useLeafyGreenTable } from "@leafygreen-ui/table";
import { WordBreak } from "components/styles";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { BaseTable } from "./BaseTable";

export default {
  component: BaseTable,
} satisfies CustomMeta<typeof BaseTable>;

export const Default: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={defaultRows} />,
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

export const NestedRows: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={nestedRows} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

export const LongContent: CustomStoryObj<typeof BaseTable> = {
  render: (args) => <TemplateComponent {...args} data={longContentRows} />,
  args: {
    shouldAlternateRowColor: true,
    darkMode: false,
  },
};

interface DataShape {
  name: string;
  type: string;
  size: string;
}

const defaultRows: DataShape[] = Array.from({ length: 100 }, (_, i) => ({
  name: `name ${i}`,
  type: `type ${i}`,
  size: `size ${i}`,
}));

const nestedRows: DataShape[] = Array.from({ length: 50 }, (_, i) => ({
  name: `name ${i}`,
  type: `type ${i}`,
  size: `size ${i}`,
  subRows: [
    {
      name: `nested name ${i}`,
      type: `nested type ${i}`,
      size: `nested size ${i}`,
    },
  ],
}));

const longContent = "long ".repeat(100);
const longContentRows: DataShape[] = Array.from({ length: 3 }, (_, i) => ({
  name: `${longContent} name ${i}`,
  type: `${longContent} type ${i}`,
  size: `${longContent} size ${i}`,
  subRows: [
    {
      name: `${longContent} nested name ${i}`,
      type: `${longContent} nested type ${i}`,
      size: `${longContent} nested size ${i}`,
    },
  ],
}));

const columns: LGColumnDef<DataShape>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
  },
  {
    accessorKey: "size",
    header: "Size",
    enableSorting: true,
    size: 60,
    cell: ({ getValue }) => <Cell value={getValue() as string} />,
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

interface CellProps {
  value: string;
}

const Cell: React.FC<CellProps> = ({ value }) => (
  <div style={{ padding: "8px 0px" }}>
    <WordBreak>{value}</WordBreak>
  </div>
);
