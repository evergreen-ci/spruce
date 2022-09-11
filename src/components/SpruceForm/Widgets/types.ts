import { SerializedStyles } from "@emotion/react";
import { WidgetProps } from "@rjsf/core";
import React from "react";

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
    labelComp: JSX.Element;
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
