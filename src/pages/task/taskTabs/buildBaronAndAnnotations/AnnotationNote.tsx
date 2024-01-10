import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import TextArea from "@leafygreen-ui/text-area";
import Tooltip from "@leafygreen-ui/tooltip";
import { useAnnotationAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  EditAnnotationNoteMutation,
  EditAnnotationNoteMutationVariables,
  Note,
} from "gql/generated/types";
import { EDIT_ANNOTATION_NOTE } from "gql/mutations";
import { useDateFormat } from "hooks";
import { ButtonWrapper } from "./BBComponents";

interface Props {
  note: Note;
  taskId: string;
  execution: number;
  userCanModify: boolean;
}

const AnnotationNote: React.FC<Props> = ({
  execution,
  note,
  taskId,
  userCanModify,
}) => {
  const getDateCopy = useDateFormat();
  const annotationAnalytics = useAnnotationAnalytics();
  const originalMessage = note?.message || "";
  const dispatchToast = useToastContext();
  const [newMessage, setMessage] = useState(originalMessage);
  useEffect(() => {
    setMessage(originalMessage);
  }, [originalMessage]);

  const [updateAnnotationNote] = useMutation<
    EditAnnotationNoteMutation,
    EditAnnotationNoteMutationVariables
  >(EDIT_ANNOTATION_NOTE, {
    onCompleted: () => {
      dispatchToast.success(`Annotation note updated.`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error updating this note: ${error.message}`,
      );
    },
    refetchQueries: ["AnnotationEventData"],
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
    <>
      <TextArea
        aria-labelledby="annotation-note-input"
        rows={4}
        id="noteInput"
        value={newMessage}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!userCanModify}
        label="Note"
        description={
          note &&
          `Updated: ${getDateCopy(note.source.time, { dateOnly: true })}
          Last Edited By: ${note.source.author}
          `
        }
      />
      <Tooltip
        trigger={
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
        }
        enabled={!userCanModify}
      >
        You are not authorized to edit failure details
      </Tooltip>
    </>
  );
};

export default AnnotationNote;
