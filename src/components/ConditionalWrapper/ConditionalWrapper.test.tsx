import React from "react";
import { render } from "test_utils/test-utils";
import { ConditionalWrapper } from "./index";

const Wrapper1 = ({ children }) => <div data-cy="wrapper-1">{children}</div>;
const Wrapper2 = ({ children }) => <div data-cy="wrapper-2">{children}</div>;
test("should render the element surrounded by a wrapper when the conditional is true", async () => {
  const { queryByDataCy } = render(
    <ConditionalWrapper
      condition
      wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
    >
      <span>Some Element</span>
    </ConditionalWrapper>
  );
  expect(queryByDataCy("wrapper-1")).toBeVisible();
  expect(queryByDataCy("wrapper-1")).toHaveTextContent("Some Element");
});

test("should render the element surrounded by no wrapper when the conditional is false and no secondary wrapper is supplied", async () => {
  const { queryByDataCy, queryByText } = render(
    <ConditionalWrapper
      condition={false}
      wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
    >
      <span>Some Element</span>
    </ConditionalWrapper>
  );
  expect(queryByDataCy("wrapper-1")).toBeNull();
  expect(queryByText("Some Element")).toBeVisible();
});

test("should render the element surrounded by the secondary wrapper when the conditional is false and a secondary wrapper is supplied", async () => {
  const { queryByDataCy, queryByText } = render(
    <ConditionalWrapper
      condition={false}
      wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
      altWrapper={(children) => <Wrapper2>{children}</Wrapper2>}
    >
      <span>Some Element</span>
    </ConditionalWrapper>
  );
  expect(queryByDataCy("wrapper-1")).toBeNull();
  expect(queryByDataCy("wrapper-2")).toBeVisible();
  expect(queryByText("Some Element")).toBeVisible();
});
