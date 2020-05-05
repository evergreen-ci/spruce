import React from "react";
import styled from "@emotion/styled/macro";
import LeafyGreenButton, { Variant } from "@leafygreen-ui/button";
import { Icon } from "antd";

interface ButtonType {
  danger: string;
  dark: string;
  default: string;
  info: string;
  primary: string;
}
type ButtonTypeKeys = keyof ButtonType;

interface Props {
  loading?: boolean;
  variant?: ButtonTypeKeys;
  onClick?: () => void;
  disabled?: boolean;
  dataCy?: string;
  glyph?: React.ReactElement;
}

export const Button: React.FC<Props> = ({
  children,
  loading,
  variant = "default",
  onClick,
  disabled,
  dataCy,
  glyph,
}) => {
  return (
    <LeafyGreenButton
      data-cy={dataCy}
      variant={mapVariantToLeafyGreenVariant[variant]}
      onClick={onClick}
      disabled={disabled}
      glyph={loading ? <StyledIcon type="loading" /> : glyph}
    >
      {children}
    </LeafyGreenButton>
  );
};

const mapVariantToLeafyGreenVariant: { [key: string]: ButtonTypeKeys } = {
  [Variant.Danger]: "danger",
  [Variant.Dark]: "dark",
  [Variant.Default]: "default",
  [Variant.Info]: "info",
  [Variant.Primary]: "primary",
};

const StyledIcon = styled(Icon)`
  margin-right: 8px;
`;
