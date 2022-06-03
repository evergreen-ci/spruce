import fs from "fs"
import path from "path"

function getCode(schema: string) {
  return `
    import gql from 'graphql-tag';
    export default gql(${schema})
  `;
}

function transform(src: string, id: string) {
  if (id.endsWith('.graphql') || id.endsWith('.gql')) {

    // find import statements and replace them with the code
    const found = src.match(/#import ".+"/gm);
    if (found) {
        found.forEach(importStatement => {
            const importPath = importStatement.replace(/#import "(.+)"/, '$1');
            // get absolute path
            const absolutePath = path.resolve(path.dirname(id), importPath);
            const importCode = fs.readFileSync(absolutePath).toString();
            src = src.replace(importStatement, importCode);
        })
    }
    return {
      code: getCode(JSON.stringify(src)),
      map: null
    };
  }
}

export default function SpruceVitePluginGQL() {
  return {
    name: 'spruce-plugin-gql',
    transform
  };
}