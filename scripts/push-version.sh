#!/bin/bash

WAIT_TIME=9
GITHUB_REMOTE=https://github.com/evergreen-ci/spruce

git push $GITHUB_REMOTE

i=$WAIT_TIME
while [ $i -gt 0 ]
  do echo -en "Waiting ${i}s for Evergreen to pick up the version\r"; sleep 1; i=$((i-1))
done
echo ""

git push --tags $GITHUB_REMOTE
