import React from "react";
import styled from "@emotion/styled/macro";
import {
  useAuthDispatchContext,
  useAuthStateContext
} from "../../context/auth";
import { Select } from "antd";
import { useQuery } from "@apollo/react-hooks";

const { Option, OptGroup } = Select;

const GET_PROJECTS = gql`
  {
    projects {
      favorites {
        identifier
        repo
        owner
        displayName
      }
      all {
        name
        projects {
          identifier
          repo
          owner
          displayName
        }
      }
    }
  }
`;

interface Project {
  displayName: string;
  repo: string;
  owner: string;
  identifier: string;
}

interface GroupedProjects {
  name: string;
  projects: Project[];
}

const renderProjectOption = ({ identifier, displayName }: Project) => (
  <Option key={identifier} value={identifier}>
    {displayName}
  </Option>
);

export const Navbar: React.FC = () => {
  const { logout } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const { data, loading } = useQuery(GET_PROJECTS);

  return (
    <Wrapper>
      <InnerWrapper>
        <StyledSelect
          showSearch={true}
          placeholder="Branch"
          optionFilterProp="children"
          loading={loading}
        >
          {data && data.projects.favorites.length > 0 && (
            <OptGroup label="Favorites">
              {data.projects.favorites.map(renderProjectOption)}
            </OptGroup>
          )}
          {data &&
            data.projects.all.map(({ name, projects }: GroupedProjects) => (
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
