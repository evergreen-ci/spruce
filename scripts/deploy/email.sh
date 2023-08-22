#!/bin/bash

BASE_URL=$REACT_APP_SPRUCE_URL
# If running locally (i.e. not on CI), fetch the email from the users git config
if [ "$CI" != 'true' ]
then
    echo "CI deploy not detected. Using local variables instead"
    # Fetch the variables from the git config.
    AUTHOR_EMAIL=$(git config user.email)
fi

# Validate necessary variables are set
if [ "$DEPLOYS_EMAIL" == '' ]
then
    echo "DEPLOYS_EMAIL is not set"
    exit 1
fi

if [ "$AUTHOR_EMAIL" == '' ]
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
PREVIOUS_DEPLOYED_COMMIT=''
PREVIOUS_TAG=''
BASE_COMMIT=''


# Get the previous deployed commit hash from bin/previous_deploy.txt
# If the file does not exist, then use the previous tag from git
if [ -f bin/previous_deploy.txt ]
then
  echo "Found previous_deploy.txt"
  PREVIOUS_DEPLOYED_COMMIT=$(cat bin/previous_deploy.txt)
  echo "Previous deployed commit: $PREVIOUS_DEPLOYED_COMMIT"
  PREVIOUS_TAG=$(git describe --abbrev=0 "$PREVIOUS_DEPLOYED_COMMIT"^)
else
  echo "Could not find previous_deploy.txt"
  echo "Falling back to previous tag from git"
  PREVIOUS_TAG=$(git describe --abbrev=0 "$CURRENT_COMMIT_HASH"^)
fi

# If this is a revert, then only include the currently deployed commit
if [ "$IS_REVERT" == 'true' ]
then
  echo "spruce-$(git rev-parse HEAD)" > body.txt
else
  if [ "$PREVIOUS_DEPLOYED_COMMIT" == '' ]
  then
    echo "Using previous tag from git"
    BASE_COMMIT=$PREVIOUS_TAG
  else
    echo "Using previous deployed commit from $BASE_URL"
    BASE_COMMIT=$PREVIOUS_DEPLOYED_COMMIT
  fi
  echo "Getting commits between $BASE_COMMIT and $CURRENT_COMMIT_HASH"
  # get all commits since the base commit
  git log --no-merges "$BASE_COMMIT".."$CURRENT_COMMIT_HASH" --pretty="%h %s" > body.txt
fi


# Detect which version of sed we have available to format the email
case "$OSTYPE" in
  darwin*)
    echo "OSX detected"
    # Format the email and inject the <br /> tag for line breaks
    sed -i'' -e "s/$/\<br\/>/" body.txt
    # # Remove single quotes from the email body.txt
    sed -i'' -e "s/'/\&lsquo;/g" body.txt
  ;;
  linux*)
    echo "LINUX detected"
    # Format the email and inject the <br /> tag for line breaks
    sed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt
    # Remove single quotes from the email body.txt
    sed -i 's|["'\'']|\&lsquo;|g' body.txt
  ;;
  *)        echo "unknown: $OSTYPE";;
esac

echo "Commits Deployed:"
cat body.txt

TITLE="Spruce Deploy to $CURRENT_COMMIT_HASH"
BODY_HTML=$(cat body.txt)"<br /> <br /><b> To revert to previous version rerun task from previous release tag ($PREVIOUS_TAG)</b>"
DATE=$(date +'%Y-%m-%d')

COMMAND="$EVERGREEN $CREDENTIALS notify email -f $AUTHOR_EMAIL -r $DEPLOYS_EMAIL -s "
COMMAND+="'"
COMMAND+="$DATE"
COMMAND+=" $TITLE"
COMMAND+="'"
COMMAND+=" -b"
COMMAND+=" '"
COMMAND+="$BODY_HTML"
COMMAND+="'"

echo "$COMMAND"
eval "$COMMAND"
