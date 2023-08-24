#!/bin/bash

PROJECT_DIRECTORY="$(pwd)"
NVM_DIR="$PROJECT_DIRECTORY/.nvm"

export PROJECT_DIRECTORY
export NVM_DIR

cat <<EOT > expansion.yml
PREPARE_SHELL: |
    PROJECT_DIRECTORY="$PROJECT_DIRECTORY"
    NVM_DIR="$NVM_DIR"

    export PATH=$PROJECT_DIRECTORY/mongodb-database-tools-ubuntu2204-x86_64-100.8.0/bin:$PATH
    export PROJECT_DIRECTORY
    export NVM_DIR

    if [ -d "${NVM_DIR}" ]; then
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
EOT

cat expansion.yml
