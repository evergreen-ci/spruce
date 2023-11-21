import LoadingRow from "./LoadingRow";

interface TableLoaderProps {
  numColumns: number;
  numRows: number;
}
const TableLoader: React.FC<TableLoaderProps> = ({
  numColumns = 1,
  numRows = 5,
}) => (
  <>
    {Array.from({ length: numRows }, (_, i) => (
      <LoadingRow key={i} numColumns={numColumns} />
    ))}
  </>
);

export default TableLoader;
