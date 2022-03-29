import { TaskStatusIconLegend, LegendContent } from ".";

export default {
  title: "Task Status Icon Legend",
  component: TaskStatusIconLegend,
};

export const LegendWithButton = () => <TaskStatusIconLegend />;

export const LegendOnly = () => <LegendContent />;
