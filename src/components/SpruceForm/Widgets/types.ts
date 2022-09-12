import { SerializedStyles } from "@emotion/react";
import { TextInputType } from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";

export interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    "aria-controls": string[];
    ariaLabelledBy: string;
    "data-cy": string;
    description: string;
    emptyValue: string | null;
    errors: string[];
    marginBottom: number;
    showLabel: boolean;
    tooltipDescription: string;
    warnings: string[];
    elementWrapperCSS: SerializedStyles;
    type: TextInputType;
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
