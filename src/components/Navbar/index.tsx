import React from "react";
import styled from "@emotion/styled/macro";
import {
  useAuthDispatchContext,
  useAuthStateContext
} from "../../context/auth";
import { Select } from "antd";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_PROJECTS,
  ProjectsQuery,
  Project
} from "graphql/queries/get-projects";

const { Option, OptGroup } = Select;

const renderProjectOption = ({ identifier, displayName }: Project) => (
  <Option key={identifier} value={identifier}>
    {displayName}
  </Option>
);

export const Navbar: React.FC = () => {
  const { logout } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const { data, loading } = useQuery<ProjectsQuery>(GET_PROJECTS);

  return (
    <Wrapper>
      <InnerWrapper>
        <StyledSelect
          showSearch={true}
          placeholder="Project"
          optionFilterProp="children"
          loading={loading}
          disabled={loading}
        >
          {data && data.projects.favorites.length > 0 && (
            <OptGroup label="Favorites">
              {data.projects.favorites.map(renderProjectOption)}
            </OptGroup>
          )}
          {data &&
            data.projects.otherProjects.map(({ name, projects }) => (
              <OptGroup key={name} label={name}>
                {projects.map(renderProjectOption)}
              </OptGroup>
            ))}
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
