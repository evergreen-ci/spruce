import Breadcrumb from "./BreadCrumb";

export default {
  title: "Breadcrumb",
  component: Breadcrumb,
};

export const Default = () => (
  <Breadcrumb breadcrumbs={[{ text: "spruce" }, { text: "511232" }]} />
);
