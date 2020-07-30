import React from "react";
import { useParams } from "react-router-dom";

export const Host: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <div>Host Page {id} !!!!!!!!</div>;
};
