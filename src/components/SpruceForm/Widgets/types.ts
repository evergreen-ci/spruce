import { WidgetProps } from "@rjsf/core";

export interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    "aria-controls": string[];
    ariaLabelledBy: string;
    "data-cy": string;
    description: string;
    emptyValue: string | null;
    marginBottom: number;
    rawErrors: string[];
    showLabel: boolean;
    tooltipDescription: string;
    warnings: string[];
  }>;
}

export type EnumSpruceWidgetProps = {
  options: {
    enumOptions: Array<{
      label: string;
      value: string;
    }>;
  };
} & SpruceWidgetProps;
