import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Input, Tooltip } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useToastContext } from "context/toast";
import {
  EditAnnotationNoteMutation,
  EditAnnotationNoteMutationVariables,
  Note,
} from "gql/generated/types";
import { EDIT_ANNOTATION_NOTE } from "gql/mutations";
import { string } from "utils";
import {
  TicketsTitle,
  TitleAndButtons,
  TopMetaDataWrapper,
  ButtonWrapper,
} from "./BBComponents";

const { getDateCopy } = string;
const { TextArea } = Input;

interface Props {
  note: Note;
  taskId: string;
  execution: number;
  userCanModify: boolean;
}

export const AnnotationNote: React.FC<Props> = ({
  note,
  taskId,
  execution,
  userCanModify,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const originalMessage = note?.message || "";
  const dispatchToast = useToastContext();
  const [newMessage, setMessage] = useState(originalMessage);
  const [updateAnnotationNote] = useMutation<
    EditAnnotationNoteMutation,
    EditAnnotationNoteMutationVariables
  >(EDIT_ANNOTATION_NOTE, {
    onCompleted: () => {
      dispatchToast.success(`Annotation note updated.`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error updating this note: ${error.message}`
      );
    },
    refetchQueries: ["GetTask"],
  });
  const saveAnnotationNote = () => {
    updateAnnotationNote({
      variables: {
        taskId,
        execution,
        originalMessage,
        newMessage,
      },
    });
    annotationAnalytics.sendEvent({ name: "Save Annotation Note" });
  };

  return (
    <TitleAndButtons>
      {/* @ts-expect-error */}
      <TicketsTitle>Note</TicketsTitle>
      {note && (
        <TopMetaDataWrapper data-cy={`${originalMessage}-metadata`}>
          <Disclaimer>
            Updated: {getDateCopy(note.source.time, { dateOnly: true })}{" "}
          </Disclaimer>
          <Disclaimer>Last Edited By: {note.source.author}</Disclaimer>
        </TopMetaDataWrapper>
      )}
      <StyledTextArea
        id="noteInput"
        rows={2}
        value={newMessage}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!userCanModify}
      />
      <ConditionalWrapper
        condition={!userCanModify}
        wrapper={(children) => (
          <Tooltip title="You are not authorized to edit task annotations">
            <span>{children}</span>
          </Tooltip>
        )}
      >
        <ButtonWrapper>
          <Button
            data-cy="edit-annotation-button"
            variant={Variant.Primary}
            size={Size.XSmall}
            onClick={saveAnnotationNote}
            disabled={originalMessage === newMessage || !userCanModify}
          >
            Save Note
          </Button>
        </ButtonWrapper>
      </ConditionalWrapper>
    </TitleAndButtons>
  );
};

const StyledTextArea = styled(TextArea)`
  width: 50%;
`;
