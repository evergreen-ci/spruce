import styled from "@emotion/styled";
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { size } from "constants/tokens";
import { PatchTriggerAliasStatus } from "../utils";

export const GithubTriggerAliasField: Field = ({ formData }) => {
  const {
    alias,
    childProjectIdentifier,
    parentAsModule,
    status,
    taskSpecifiers,
  } = formData;

  const hoverContent = (
    <>
      <Body>
        <strong>Project:</strong> {childProjectIdentifier}
      </Body>
      {parentAsModule && (
        <Body>
          <strong>Module:</strong> {parentAsModule}
        </Body>
      )}
      {status && (
        <Body>
          <strong>Wait On:</strong> {PatchTriggerAliasStatus[status]}
        </Body>
      )}
      {!!taskSpecifiers.length && (
        <>
          <Body>
            <strong>Variant/Task Regex Pairs</strong>
          </Body>
          <Ul>
            {taskSpecifiers.map(
              ({ patchAlias, taskRegex, variantRegex }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>
                  {patchAlias ? (
                    <>Patch Alias: {patchAlias}</>
                  ) : (
                    <>
                      Variants: <InlineCode>{variantRegex}</InlineCode>
                      <br />
                      Tasks: <InlineCode>{taskRegex}</InlineCode>
                    </>
                  )}
                </li>
              ),
            )}
          </Ul>
        </>
      )}
    </>
  );

  return (
    <InlineDefinition
      align="right"
      justify="start"
      definition={hoverContent}
      data-cy="pta-tooltip"
    >
      <span data-cy="pta-item">{alias}</span>
    </InlineDefinition>
  );
};

const Ul = styled.ul`
  margin-bottom: 0;
  padding-left: ${size.s};
`;
