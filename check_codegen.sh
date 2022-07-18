# This is a script which checks if yarn codegen was run it used by the check_codegen evergreen task

# save types file variable
types_file="src/gql/generated/types.ts"
{
  BEFORE=$(git status --porcelain | grep "$types_file")
  yarn codegen
  AFTER=$(git status --porcelain | grep "$types_file")
  if [ "$BEFORE" != "$AFTER" ]; then
    echo "$types_file is not up to date"
    echo "did you forget to run 'yarn codegen'?"
    if [ -d "bin" ] 
    then
        echo "Directory /bin exists." 
    else
        echo "Directory /bin does not exist."
        mkdir bin
    fi
    git diff $types_file >> bin/codegen.diff
    exit 1
  else
    echo "$types_file is up to date"
    exit 0
  fi

} || {
  echo "script failed"
  exit 1
}

