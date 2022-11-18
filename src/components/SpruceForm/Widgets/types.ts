import { SerializedStyles } from "@emotion/react";
import { TextInputType } from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";

export interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    "aria-controls": string[];
    "data-cy": string;
    ariaLabelledBy: string;
    description: string;
    elementWrapperCSS: SerializedStyles;
    emptyValue: string | null;
    errors: string[];
    showLabel: boolean;
    tooltipDescription: string;
    inputType: TextInputType;
    warnings: string[];
    customLabel: string;
  }>;
}

export type EnumSpruceWidgetProps = {
  options: {
    enumDisabled: string[];
    enumOptions: Array<{
      label: string;
      value: string;
    }>;
  };
} & SpruceWidgetProps;
