import { SerializedStyles } from "@emotion/react";
import { TextInputType } from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";

export interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    "aria-controls": string[];
    "data-cy": string;
    ariaLabelledBy: string;
    customLabel: string;
    description: string;
    elementWrapperCSS: SerializedStyles;
    emptyValue: string | null;
    errors: string[];
    focusOnMount: boolean;
    inputType: TextInputType;
    showLabel: boolean;
    sizeVariant: string;
    tooltipDescription: string;
    warnings: string[];
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
