# This script runs appVersion.js which fetches the version number from the
# package.json file and writes it to a env variable.
export REACT_APP_VERSION=$(node -pe "require('./package.json').version")
echo $REACT_APP_VERSION