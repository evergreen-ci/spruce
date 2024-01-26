import { StoryObj, Meta } from "@storybook/react";
import { ApolloMock } from "types/gql";

type CustomStorybookReactRouterParams = {
  initialEntries?: string[];
  path?: string;
  route?: string;
};
type CustomStorybookMockApolloProviderParams = {
  mocks: ApolloMock<any, any>[];
};

type CustomStorybookParams = {
  reactRouter?: CustomStorybookReactRouterParams;
  apolloClient?: CustomStorybookMockApolloProviderParams;
  storyshots?: {
    disable?: boolean;
  };
};

type CustomStoryObj<T extends any> = StoryObj<T> & {
  parameters?: CustomStorybookParams;
};

type CustomMeta<T extends any> = Meta<T> & {
  parameters?: CustomStorybookParams;
};

export type { CustomStoryObj, CustomMeta };
