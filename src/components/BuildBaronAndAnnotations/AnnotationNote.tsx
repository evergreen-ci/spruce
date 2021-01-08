import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Input, Tooltip } from "antd";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useBannerDispatchContext } from "context/banners";
import {
  EditAnnotationNoteMutation,
  EditAnnotationNoteMutationVariables,
  Note,
} from "gql/generated/types";
import { EDIT_ANNOTATION_NOTE } from "gql/mutations";
import { getDateCopy } from "utils/string";
import {
  TicketsTitle,
  TitleAndButtons,
  TopMetaDataWrapper,
  ButtonWrapper,
} from "./BBComponents";

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
  const originalMessage = note?.message;
  const dispatchBanner = useBannerDispatchContext();
  const [newMessage, setMessage] = useState(originalMessage);
  const [
    updateAnnotationNote,
    { loading: loadingAnnotationNote },
  ] = useMutation<
    EditAnnotationNoteMutation,
    EditAnnotationNoteMutationVariables
  >(EDIT_ANNOTATION_NOTE, {
    onCompleted: () => {
      dispatchBanner.successBanner(`Annotation note updated.`);
    },
    onError(error) {
      dispatchBanner.errorBanner(
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
  };

  return (
    <TitleAndButtons>
      <TicketsTitle>Note</TicketsTitle>
      {note && (
        <TopMetaDataWrapper data-cy={`${originalMessage}-metadata`}>
          <Disclaimer>
            Updated: {getDateCopy(note.source.time, null, true)}{" "}
          </Disclaimer>
          <Disclaimer>Last Edited By: {note.source.author}</Disclaimer>
        </TopMetaDataWrapper>
      )}
      <StyledTextArea
        id="noteInput"
        rows={2}
        value={newMessage}
        onChange={(e) => setMessage(e.target.value)}
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
            loading={loadingAnnotationNote}
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
