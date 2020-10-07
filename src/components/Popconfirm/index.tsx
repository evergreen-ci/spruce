import React from "react";
import { Popconfirm as AntPopconfirm } from "antd";

export const Popconfirm: React.FC<React.ComponentProps<
  typeof AntPopconfirm
>> = ({ children, ...props }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <span
    onClick={(e) => {
      e.stopPropagation(); // Stop click propagation for clicks on Popconfirm popup body.
    }}
  >
    <AntPopconfirm {...props}>{children}</AntPopconfirm>
  </span>
);
