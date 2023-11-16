import { useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { Description } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useQueryParams } from "hooks/useQueryParam";
import { MainlineCommitQueryParams } from "types/commits";

interface GitCommitSearchProps {
  setMenuOpen: (open: boolean) => void;
}

export const GitCommitSearch: React.FC<GitCommitSearchProps> = ({
  setMenuOpen,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [, setQueryParams] = useQueryParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [commitHash, setCommitHash] = useState("");

  const onCancel = () => {
    setModalOpen(false);
    setMenuOpen(false);
  };

  const onConfirm = () => {
    sendEvent({ name: "Search for commit", commit: commitHash });
    setQueryParams({
      [MainlineCommitQueryParams.Revision]: commitHash,
    });
    onCancel();
  };

  return (
    <>
      <DropdownItem
        data-cy="git-commit-search"
        onClick={() => {
          setModalOpen(true);
          sendEvent({ name: "Open Git Commit Search Modal" });
        }}
      >
        Search by Git Hash
      </DropdownItem>
      <ConfirmationModal
        buttonText="Submit"
        data-cy="git-commit-search-modal"
        onCancel={onCancel}
        onConfirm={onConfirm}
        open={modalOpen}
        // Force user to input at least 7 characters of the hash.
        submitDisabled={commitHash.trim().length < 7}
        title="Search by Git Commit Hash"
      >
        <StyledDescription>
          Note: This is an experimental feature that works best without any
          filters. Searching for a git hash will clear all applied filters.
        </StyledDescription>
        <TextInput
          label="Git Commit Hash"
          onChange={(e) => setCommitHash(e.target.value.trim())}
          onKeyPress={(e) => e.key === "Enter" && onConfirm()}
          value={commitHash}
        />
      </ConfirmationModal>
    </>
  );
};

const StyledDescription = styled(Description)`
  margin-bottom: ${size.xs};
`;
