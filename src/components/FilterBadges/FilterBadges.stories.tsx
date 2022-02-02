import { withKnobs, text, button } from "@storybook/addon-knobs";
import { withQuery } from "@storybook/addon-queryparams";
import { useLocation, BrowserRouter } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { ProjectFilterOptions } from "types/commits";
import { queryString, url } from "utils";
import { FilterBadges } from ".";

const { upsertQueryParam } = url;
const { parseQueryString } = queryString;

export default {
  title: "FilterBadges",
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
    withKnobs,
    withQuery,
  ],
  component: FilterBadges,
};
export const Default = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const badgeKey = text("Badge Key", "");
  const badgeValue = text("Badge Value", "");
  const addBadge = () => {
    const params = upsertQueryParam(queryParams[badgeKey], badgeValue);
    updateQueryParams({ [badgeKey]: params });
  };
  button("Add Badge", addBadge);
  return (
    <FilterBadges
      queryParamsToDisplay={new Set([ProjectFilterOptions.BuildVariant])}
    />
  );
};

Default.parameters = {
  query: {
    buildVariants:
      "! Enterprise Clang Tidy,! Enterprise Windows,Enterprise RHEL 8.0 (Lock Free Reads disabled)",
  },
};
