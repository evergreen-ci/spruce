#!/bin/bash

BASE_URL=https://spruce.mongodb.com


# First download the currently deployed commit hash from s3
# If the curl succeeds, and is exactly 40 characters, then use that commit hash
# If the curl fails, then use the previous tag from git
PREVIOUS_DEPLOYED_COMMIT=$(curl -s "$BASE_URL"/commit.txt)
# If the curl is more than 40 characters, then it's not a commit hash
if [ ${#PREVIOUS_DEPLOYED_COMMIT} -gt 40 ]
then
    echo "curl failed"
    echo "Using previous tag from git"
    PREVIOUS_DEPLOYED_COMMIT=$(git describe --tags --abbrev=0)
fi

if [ "$PREVIOUS_DEPLOYED_COMMIT" == "" ]
then
    echo "PREVIOUS_DEPLOYED_COMMIT not found"
    exit 1
fi

# Validate if bin directory exists
if [ ! -d "bin" ]
then
    mkdir bin
fi
# Save the current commit hash to a file
echo "$PREVIOUS_DEPLOYED_COMMIT"
echo "$PREVIOUS_DEPLOYED_COMMIT" > bin/previous_deploy.txt
