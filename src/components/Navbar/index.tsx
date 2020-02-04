import React from "react";
import styled from "@emotion/styled/macro";
import {
  useAuthDispatchContext,
  useAuthStateContext
} from "../../context/auth";
import { Select } from "antd";

const { Option, OptGroup } = Select;

export const Navbar: React.FC = () => {
  const { logout } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  return (
    <Wrapper>
      <InnerWrapper>
        <StyledSelect
          showSearch={true}
          placeholder="Branch"
          optionFilterProp="children"
          defaultValue={["spruce"]}
        >
          <OptGroup label="Favorites">
            <Option value="evergreen-favorite">Evergreen</Option>
            <Option value="spruce-favorite">Spruce</Option>
          </OptGroup>
          <OptGroup label="Engineer">
            <Option value="evergreen">Evergreen</Option>
            <Option value="spruce">Spruce</Option>
            <Option value="cloud">Cloud</Option>
            <Option value="build">Build</Option>
          </OptGroup>
        </StyledSelect>
        {isAuthenticated && (
          <LogoutButton id="logout" onClick={logout}>
            Logout
          </LogoutButton>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 20px;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

const StyledSelect = styled(Select)`
  width: 200px;
  margin-right: 12px;
`;

const LogoutButton = styled.div`
  cursor: pointer;
`;
