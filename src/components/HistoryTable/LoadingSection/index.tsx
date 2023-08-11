import LoadingRow from "components/HistoryTable/LoadingSection/LoadingRow";

interface LoadingSectionProps {
  numVisibleCols: number;
  numLoadingRows: number;
}

const LoadingSection: React.FC<LoadingSectionProps> = ({
  numLoadingRows,
  numVisibleCols,
}) => (
  <>
    {Array.from(Array(numLoadingRows)).map((_, index) => (
      // Disabling key index rules since there is nothing unique about these rows
      <LoadingRow
        key={`loading_row_${index}`} // eslint-disable-line react/no-array-index-key
        numVisibleCols={numVisibleCols}
      />
    ))}
  </>
);

export default LoadingSection;
