#!/bin/bash

export PROJECT_DIRECTORY="$(pwd)"
export NVM_DIR="$PROJECT_DIRECTORY/.nvm"

cat <<EOT > expansion.yml
PREPARE_SHELL: |
    export PROJECT_DIRECTORY="$PROJECT_DIRECTORY"
    export NVM_DIR="$NVM_DIR"

    if [ -d "${NVM_DIR}" ]; then
      cd $PROJECT_DIRECTORY
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
      cd -
    fi
EOT

cat expansion.yml
