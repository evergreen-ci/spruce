import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Input, Tooltip } from "antd";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { Modal } from "components/Modal";
import { WideButton } from "components/Spawn";
import { useBannerDispatchContext } from "context/banners";

import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations/add-annotation";

const { TextArea } = Input;
interface Props {
  visible: boolean;
  dataCy: string;
  closeModal: () => void;
  taskId: string;
  execution: number;
  isIssue: boolean;
}

export const AddIssueModal: React.FC<Props> = ({
  visible,
  dataCy,
  closeModal,
  taskId,
  execution,
  isIssue,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const title = isIssue ? "Add Issue" : "Add Suspected Issue";
  const issueString = isIssue ? "issue" : "suspected issue";

  const [url, setUrlValue] = useState<string>("");
  const [issueKey, setIssueKey] = useState<string>("");

  const resetForm = () => {
    setUrlValue("");
    setIssueKey("");
  };

  const [addAnnotation, { loading: loadingAddAnnotation }] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchBanner.successBanner(`Successfully added ${issueString}`);
    },
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error adding the issue: ${error.message}`
      );
    },
    refetchQueries: ["GetTask"],
  });

  const onClickAdd = () => {
    // todo: add analytics
    const apiIssue = {
      url,
      issueKey,
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
    resetForm();
    closeModal();
  };

  const onClickCancel = () => {
    resetForm();
    closeModal();
  };

  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onClickCancel}
      title={title}
      footer={[
        <>
          <WideButton dataCy="modal-cancel-button" onClick={onClickCancel}>
            Cancel
          </WideButton>{" "}
          <ConditionalWithMargin
            condition={url === "" || issueKey === ""}
            wrapper={(children) => (
              <Tooltip title="Url and display text are required">
                <span>{children}</span>
              </Tooltip>
            )}
          >
            <WideButton
              dataCy="modal-update-button"
              variant="primary"
              disabled={url === "" || issueKey === ""}
              loading={loadingAddAnnotation}
              onClick={onClickAdd}
            >
              Save
            </WideButton>
          </ConditionalWithMargin>
        </>,
      ]}
    >
      <Body weight="medium">URL</Body>
      <StyledTextArea
        data-cy="url-text-area"
        autoSize={{ minRows: 1, maxRows: 2 }}
        value={url}
        onChange={(e) => setUrlValue(e.target.value)}
      />
      <Body weight="medium">Display Text</Body>
      <StyledTextArea
        data-cy="issue-key-text-area"
        autoSize={{ minRows: 1, maxRows: 2 }}
        value={issueKey}
        onChange={(e) => setIssueKey(e.target.value)}
      />
    </Modal>
  );
};

const StyledTextArea = styled(TextArea)`
  margin-bottom: 40px;
  resize: none;
`;

const ConditionalWithMargin = styled(ConditionalWrapper)`
  margin-left: 16px;
`;
