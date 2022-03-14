import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { size } from "constants/tokens";

export const GithubTriggerAliasField: Field = ({ formData }) => {
  const {
    alias,
    childProjectIdentifier,
    parentAsModule,
    status,
    taskSpecifiers,
  } = formData;
  return (
    <Tooltip align="right" trigger={<Body>{alias}</Body>}>
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
          <strong>Wait On:</strong> {status}
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
                    <>
                      <strong>Patch Alias:</strong> {patchAlias}
                    </>
                  ) : (
                    <>
                      Variants: <InlineCode>{variantRegex}</InlineCode>
                      <br />
                      Tasks: <InlineCode>{taskRegex}</InlineCode>
                    </>
                  )}
                </li>
              )
            )}
          </Ul>
        </>
      )}
    </Tooltip>
  );
};

const Ul = styled.ul`
  padding-left: ${size.s};
`;
