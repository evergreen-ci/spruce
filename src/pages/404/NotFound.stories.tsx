import NotFound from "./NotFound";

export default {
  title: "Not Found",
  component: NotFound,
};

export const Default404 = () => (
  <div style={{ height: "100%", width: "100%" }}>
    <NotFound />
  </div>
);
