import React from "react";
import { Select } from "antd";
import { ProjectsQuery, Project } from "graphql/queries/get-projects";
import styled from "@emotion/styled/macro";

export const { Option, OptGroup } = Select;

const renderProjectOption = ({ identifier, displayName }: Project) => (
  <Option key={identifier} value={identifier}>
    {displayName}
  </Option>
);

export interface ProjectSelectProps {
  data: ProjectsQuery;
  loading: boolean;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  data,
  loading
}) => {
  return (
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
  );
};

const StyledSelect = styled(Select)`
  width: 400px;
  margin-right: 12px;
`;
