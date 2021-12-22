if [[ $(git status --porcelain | grep src/gql/generated/types.ts) ]]; then
  echo "src/gql/types.ts is not up to date"
  echo "did you forget to run 'yarn codegen'?"
  exit 1
else
  exit 0
fi