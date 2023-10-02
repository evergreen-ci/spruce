import { useState } from "react";
import TextInput from "@leafygreen-ui/text-input";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { MainlineCommitQueryParams } from "types/commits";

interface GitCommitSearchProps {
  setMenuOpen: (open: boolean) => void;
}

export const GitCommitSearch: React.FC<GitCommitSearchProps> = ({
  setMenuOpen,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const updateQueryParams = useUpdateURLQueryParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commitHash, setCommitHash] = useState("");

  const onSubmit = () => {
    sendEvent({ name: "Search for commit", commit: commitHash });
    updateQueryParams({
      [MainlineCommitQueryParams.Revision]: commitHash,
      [MainlineCommitQueryParams.SkipOrderNumber]: undefined,
    });
    setIsModalVisible(false);
    setMenuOpen(false);
  };

  return (
    <>
      <DropdownItem
        data-cy="git-commit-search"
        onClick={() => {
          setIsModalVisible(true);
          sendEvent({ name: "Open Git Commit Search Modal" });
        }}
      >
        Search by Git Commit
      </DropdownItem>
      <ConfirmationModal
        buttonText="Submit"
        data-cy="git-commit-search-modal"
        onCancel={() => setIsModalVisible(false)}
        onConfirm={onSubmit}
        open={isModalVisible}
        // Force user to input at least 7 characters of the hash.
        submitDisabled={commitHash.trim().length < 7}
        title="Search by Git Commit Hash"
      >
        <TextInput
          label="Git Commit Hash"
          onChange={(e) => setCommitHash(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          value={commitHash}
        />
      </ConfirmationModal>
    </>
  );
};
