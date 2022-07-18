# This is a script which checks if yarn codegen was run it used by the check_codegen evergreen task
BEFORE=$(git status --porcelain | grep src/gql/generated/types.ts)
yarn codegen
AFTER=$(git status --porcelain | grep src/gql/generated/types.ts)
if [ "$BEFORE" != "$AFTER" ]; then
  echo "src/gql/generated/types.ts is not up to date"
  echo "did you forget to run 'yarn codegen'?"
  mkdir tmp
  git diff >> tmp/codegen.diff
  exit 1
else
  echo "src/gql/generated/types.ts is up to date"
  exit 0
fi