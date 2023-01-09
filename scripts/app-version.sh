#!/bin/bash

# This script fetches the version of the app from the package.json file
# and writes it to a env variable. It also adds a flag if this is a custom build

HAS_CHANGES=False
if [[ -n $(git diff) ]]; then
    HAS_CHANGES=True
fi

REACT_APP_VERSION=$(node -pe "require('./package.json').version")

# If there are changes add the custom flag to REACT_APP_VERSION
if [[ $HAS_CHANGES == True ]]; then
    REACT_APP_VERSION="${REACT_APP_VERSION}-custom"
fi
export REACT_APP_VERSION
echo $REACT_APP_VERSION