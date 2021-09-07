import { HistoryTableProvider } from "./HistoryTableContext";
import HistoryTable from "./index";
import { mainlineCommitData } from "./testData";

export default {
  title: "History Table",
};

export const Default = () => (
  <HistoryTableProvider>
    <HistoryTableWrapper />
  </HistoryTableProvider>
);

const HistoryTableWrapper = () => {
  const data = { ...mainlineCommitData };

  return (
    <HistoryTable
      recentlyFetchedCommits={data as any}
      loadMoreItems={() => console.log("Fetch")}
    />
  );
};
