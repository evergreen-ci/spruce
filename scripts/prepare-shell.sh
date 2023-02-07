#!/bin/bash

pushd "$(dirname "$0")" >/dev/null
    PROJECT_DIRECTORY="$(pwd -P)"
    export PROJECT_DIRECTORY
popd >/dev/null

NVM_DIR="$PROJECT_DIRECTORY/.nvm"
export NVM_DIR

cat <<EOT > expansion.yml
PREPARE_SHELL: |
    PROJECT_DIRECTORY="$PROJECT_DIRECTORY"
    NVM_DIR="$NVM_DIR"

    export PROJECT_DIRECTORY
    export NVM_DIR

    if [ -d "${NVM_DIR}" ]; then
      pushd "$PROJECT_DIRECTORY"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      popd
    fi
EOT

cat expansion.yml
