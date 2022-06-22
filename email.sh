#!/bin/bash

# If running locally (i.e. not on CI), fetch the email from the users git config
if [ "$CI" != 'true' ]
then
    echo "CI deploy not detected. Using local variables instead"
    # Fetch the variables from the git config.
    AUTHOR_EMAIL=$(git config user.email)
    REACT_APP_DEPLOYS_EMAIL=$REACT_APP_DEPLOYS_EMAIL
fi

# Validate necessary variables are set
if [ '$REACT_APP_DEPLOYS_EMAIL' == '' ]
then
    echo "REACT_APP_DEPLOYS_EMAIL is not set"
    exit 1
fi

if [ '$AUTHOR_EMAIL' == '' ]
then
    echo "AUTHOR_EMAIL is not set"
    exit 1
fi

IS_REVERT=false
# If execution exists and is not 0 (i.e. not a revert), then set the revert flag
if [ "$EXECUTION" != '' ] && [ "$EXECUTION" != '0' ]
then
    IS_REVERT=true
fi


# Determine which verson of evergreen is available and use that
if ! [ -x "$(command -v evergreen)" ]
then
  echo 'evergreen is not on $PATH.'
  echo 'Trying to use the local binary'
  if ! [ -x "$(command -v ~/evergreen)" ]
  then
    echo 'Error: Could not find evergreen binary on home directory'
    exit 1
  else
    echo 'Found evergreen binary on home directory'
    EVERGREEN=~/evergreen
    CREDENTIALS='-c .evergreen.yml'
  fi
else
  echo 'Found evergreen binary on $PATH'
  EVERGREEN=evergreen
fi

# Fetch previous release tag and get the commits since that tag
CURRENT_COMMIT_HASH=$(git rev-parse --short HEAD)
PREVIOUS_TAG=$(git describe --abbrev=0 $CURRENT_COMMIT_HASH\^)

# If this is a revert, then only include the currently deployed commit
if [ "$IS_REVERT" == 'true' ]
then
  echo "spruce-$(git rev-parse HEAD)" > body.txt
else
# get all commits since the previous tag
  git log --no-merges $PREVIOUS_TAG..$CURRENT_COMMIT_HASH --pretty="%h %s" > body.txt
fi


# Detect which version of sed we have available to format the email
case "$OSTYPE" in
  darwin*)
    echo "OSX detected using gsed"
    # Format the email and inject the <br /> tag for line breaks
    gsed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt
    # Remove single quotes from the email body
    gsed -i 's|["'\'']||g' body.txt
  ;;
  linux*)
    echo "LINUX detected using sed"
    # Format the email and inject the <br /> tag for line breaks
    sed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt
    # Remove single quotes from the email body
    sed -i 's|["'\'']||g' body.txt
  ;;
  *)        echo "unknown: $OSTYPE";;
esac

echo "Commits Deployed:"
cat body.txt

TITLE="Spruce Deploy to $CURRENT_COMMIT_HASH"
BODY_HTML=$(cat body.txt)$(echo "<br /> <br /><b> To revert to previous version rerun task from previous release tag ($PREVIOUS_TAG)</b>")
DATE=$(date +'%Y-%m-%d')

COMMAND="$EVERGREEN $CREDENTIALS notify email -f $AUTHOR_EMAIL -r $REACT_APP_DEPLOYS_EMAIL -s "
COMMAND+="'"
COMMAND+="$DATE"
COMMAND+=" $TITLE"
COMMAND+="'"
COMMAND+=" -b"
COMMAND+=" '"
COMMAND+="$BODY_HTML"
COMMAND+="'"

echo $COMMAND
eval $COMMAND
