import { withKnobs, text, button } from "@storybook/addon-knobs";
import { withQuery } from "@storybook/addon-queryparams";
import { MemoryRouter } from "react-router-dom";
import { FilterBadges } from ".";

export default {
  title: "FilterBadges",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    withQuery,
    withKnobs,
  ],
};

export const Default = () => {
  text("Badge Key", "someKey");
  text("Badge Value", "someValue");
  button("Add Badge", () => console.log("Added something"));

  return (
    <>
      <FilterBadges />
    </>
  );
};

Default.parameters = {
  query: {
    mock: ["Hello world!", "something"],
  },
};
