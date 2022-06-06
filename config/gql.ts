import fs from "fs"
import path from "path"

function getCode(schema: string) {
  return `
    import gql from 'graphql-tag';
    export default gql(${schema})
  `;
}

function transform(src: string, id: string) {
  if (id.endsWith(".graphql") || id.endsWith(".gql")) {
    const transformedQueries = findAndReplaceFragments(src, id);
    return {
      code: getCode(JSON.stringify(transformedQueries)),
      map: null,
    };
  }
}

const findAndReplaceFragments = (fragment: string, relativePath: string) => {
  let updatedFragment = fragment;
  const matches = updatedFragment.match(/#import ".+"/gm);
  if (matches) {
    matches.forEach((match) => {
      const importPath = match.replace(/#import "(.+)"/, "$1");
      // get absolute path
      const absolutePath = path.resolve(path.dirname(relativePath), importPath);
      // read file
      const importCode = fs.readFileSync(absolutePath).toString();
      // recursively navigate through fragments and replace them
      updatedFragment = updatedFragment.replace(
        match,
        findAndReplaceFragments(importCode, absolutePath)
      );
    });
  }
  return updatedFragment;
};

/**
 * SpruceVitePluginGQL is a vite plugin that transforms graphql files and also handles processing fragments
 * @returns Plugin
 */
export default function SpruceVitePluginGQL() {
  return {
    name: "spruce-plugin-gql",
    transform,
  };
}
