#!/bin/bash

WAIT_TIME=10
GITHUB_REMOTE=https://github.com/evergreen-ci/spruce

git push $GITHUB_REMOTE

echo -n "Waiting ${WAIT_TIME}s for Evergreen to pick up the version"

i=0
while [ $i -lt $WAIT_TIME ]
  do echo -n .; sleep 1; i=$((i+1))
done
echo ""

git push --tags $GITHUB_REMOTE
