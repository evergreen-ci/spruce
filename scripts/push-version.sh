#!/bin/bash

WAIT_TIME=9
GIT_DESTINATION=$(git rev-parse --abbrev-ref @{upstream})

if git push upstream
then
  echo "Successfully pushed to ${GIT_DESTINATION}"
else
  echo "Failed to push to ${GIT_DESTINATION}"
  exit 1
fi

i=$WAIT_TIME
while [ $i -gt 0 ]
  do echo -en "Waiting ${i}s for Evergreen to pick up the version\r"; sleep 1; i=$((i-1))
done
echo ""

if git push --tags upstream
then
  echo "Successfully pushed tags to ${GIT_DESTINATION}"
else 
  echo "Failed to push tags to ${GIT_DESTINATION}"
  exit 1
fi

