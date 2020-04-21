import gql from "graphql-tag";

export type ProjectVariants = Array<{
  name: string;
  displayName: string;
  tasks: string[];
}>;
export interface PatchProject {
  tasks?: string[];
  variants?: ProjectVariants;
}

export type VariantsTasks = Array<{
  name: string;
  tasks: string[];
}>;

export interface Patch {
  id: string;
  description: string;
  projectID: string;
  githash: string;
  patchNumber: number;
  author: string;
  version: string;
  status: string;
  activated: boolean;
  alias: string;
  taskCount: string;
  duration: {
    makespan: string;
    timeTaken: string;
  };
  time: {
    started?: string;
    finished?: string;
    submittedAt: string;
  };
  project: PatchProject;
  variantsTasks: VariantsTasks;
}

export interface PatchQuery {
  patch: Patch;
}

export const GET_PATCH = gql`
  query Patch($id: String!) {
    patch(id: $id) {
      id
      description
      projectID
      githash
      patchNumber
      author
      version
      status
      activated
      alias
      taskCount
      duration {
        makespan
        timeTaken
      }
      time {
        started
        submittedAt
        finished
      }
      variantsTasks {
        name
        tasks
      }
    }
  }
`;

export const GET_PATCH_CONFIGURE = gql`
  query Patch($id: String!) {
    patch(id: $id) {
      id
      description
      author
      status
      activated
      time {
        submittedAt
      }
      project {
        tasks
        variants {
          name
          displayName
          tasks
        }
      }
      variantsTasks {
        name
        tasks
      }
    }
  }
`;
