/// <reference types="vite/client" />

declare module "*.graphql" {
  import { DocumentNode } from "graphql";

  const content: DocumentNode;
  export default content;
}

declare const APP_VERSION: string;
