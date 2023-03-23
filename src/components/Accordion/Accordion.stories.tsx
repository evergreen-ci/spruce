import { Accordion } from ".";

export default {
  title: "Components/Accordion",
  component: Accordion,
};

export const Default = (args) => <Accordion {...args} />;

Default.args = {
  title: "Accordion",
  children: "Accordion content",
};
