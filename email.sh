#!/bin/bash

# If running locally (i.e. not on CI), fetch the email from the users git config
if [ $CI != 'true' ]
then
    echo "CI deploy not detected. Using local variables instead"
    # Fetch the variables from the git config.
    AUTHOR_EMAIL=$(git config user.email)
    REACT_APP_DEPLOYS_EMAIL=$REACT_APP_DEPLOYS_EMAIL
    TASK_NAME=$(git rev-parse HEAD)
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

if [ '$TASK_NAME' == '' ]
then
    echo "Was unable to fetch the task_name or git commit associated with this build"
    exit 1
fi

# Fetch previous release tag and get the commits since that tag
PREVIOUS_VERSION=$(git describe --tags  --abbrev=0  `git rev-list --tags --max-count=1 --skip=1`)
git log --no-merges $PREVIOUS_VERSION..HEAD --pretty="format:%s (%h)" > body.txt

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

# Detect which version of sed we have available to format the email
case "$OSTYPE" in
  darwin*)
    echo "OSX detected using gsed"
    gsed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt

  ;;
  linux*)
    echo "LINUX detected using sed"
    sed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt
  ;;
  *)        echo "unknown: $OSTYPE";;
esac


BODY_HTML=$(cat body.txt)
DATE=$(date +'%m/%d/%Y')
COMMAND="$EVERGREEN $CREDENTIALS notify email -f $AUTHOR_EMAIL -r $REACT_APP_DEPLOYS_EMAIL -s "
COMMAND+="'"
COMMAND+="$DATE"
COMMAND+=" Spruce Deploy $TASK_NAME"
COMMAND+="'"
COMMAND+=" -b"
COMMAND+=" '"
COMMAND+="$BODY_HTML"
COMMAND+="'"
echo $COMMAND
eval $COMMAND
