import Breadcrumbs from ".";

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
};

export const Default = () => (
  <Breadcrumbs breadcrumbs={[{ text: "spruce" }, { text: "511232" }]} />
);
