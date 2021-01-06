import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Input } from "antd";
import {
  EditAnnotationNoteMutation,
  EditAnnotationNoteMutationVariables,
  Note,
} from "gql/generated/types";
import { useBannerDispatchContext } from "../../context/banners";
import { EDIT_ANNOTATION_NOTE } from "../../gql/mutations/edit-annotation-note";
import { getDateCopy } from "../../utils/string";
import { TicketsTitle, TitleAndButtons, MetaDataWrapper } from "./BBComponents";

interface Props {
  note: Note;
  taskId: string;
  execution: number;
}

export const AnnotationNote: React.FC<Props> = ({
  note,
  taskId,
  execution,
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
        <>
          <MetaDataWrapper data-cy={`${originalMessage}-metadata`}>
            <Disclaimer>
              Updated: {getDateCopy(note.source.time, null, true)}{" "}
            </Disclaimer>
            <Disclaimer>Last Edited By: {note.source.author}</Disclaimer>
          </MetaDataWrapper>
        </>
      )}
      <TextArea
        id="noteInput"
        rows={2}
        style={{ width: 600 }}
        value={newMessage}
        onChange={(e) => setMessage(e.target.value)}
      />
      <ButtonWrapper>
        <Button
          data-cy="file-ticket-button"
          variant={Variant.Primary}
          size="xsmall"
          loading={loadingAnnotationNote}
          onClick={saveAnnotationNote}
          disabled={originalMessage === newMessage}
        >
          Save Note
        </Button>
      </ButtonWrapper>
    </TitleAndButtons>
  );
};

const ButtonWrapper = styled.div`
  margin-right: 8px;
  padding-top: 5px;
`;
const { TextArea } = Input;
