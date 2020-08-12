import React from "react";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";

export const PublicKeysTab: React.FC = () => (
  <div>
    <Button size="small" data-cy="add-key-button" glyph={<Icon glyph="Plus" />}>
      Add New Key
    </Button>
  </div>
);
