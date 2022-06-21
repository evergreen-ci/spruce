const fs = require("fs")
const path  = require("path")

function getCode(schema) {
  return `
    import gql from 'graphql-tag';
    export default gql(${schema})
  `;
}

function transform(src, id) {
  if (id.endsWith('.graphql') || id.endsWith('.gql')) {

    src = findAndReplaceFragments(src, id);
    return {
      code: getCode(JSON.stringify(src)),
      map: null
    };
  }
}

const findAndReplaceFragments = (fragment, relativePath) => {
    const matches = fragment.match(/#import ".+"/gm);
    if(matches) {
        matches.forEach(match => {
            const importPath = match.replace(/#import "(.+)"/, '$1');
            // get absolute path
            const absolutePath = path.resolve(path.dirname(relativePath), importPath);
            // read file
            const importCode = fs.readFileSync(absolutePath).toString();
            // recursively navigate through fragments and replace them
            fragment = fragment.replace(match, findAndReplaceFragments(importCode, absolutePath));
        })
    }
    return fragment;
}

/**
 * SpruceVitePluginGQL is a vite plugin that transforms graphql files and also handles processing fragments
 * @returns Plugin
 */
module.exports = function SpruceVitePluginGQL() {
  return {
    name: 'spruce-plugin-gql',
    transform
  };
}