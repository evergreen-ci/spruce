#!/bin/bash

WAIT_TIME=9
GITHUB_REMOTE=https://github.com/evergreen-ci/spruce

if git push $GITHUB_REMOTE
then
  echo "Successfully pushed to ${GITHUB_REMOTE}"
else
  echo "Failed to push to ${GITHUB_REMOTE}"
  exit 1
fi

i=$WAIT_TIME
while [ $i -gt 0 ]
  do echo -en "Waiting ${i}s for Evergreen to pick up the version\r"; sleep 1; i=$((i-1))
done
echo ""

if git push --tags $GITHUB_REMOTE
then
  echo "Successfully pushed tags to ${GITHUB_REMOTE}"
else 
  echo "Failed to push tags to ${GITHUB_REMOTE}"
  exit 1
fi

