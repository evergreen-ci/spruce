#!/bin/bash

# This script runs the AWS CLI command to deploy the app to S3.

echo "Deploying to S3"

if ! aws s3 sync build/ s3://"${BUCKET}"/ --acl public-read --follow-symlinks --delete --exclude .env-cmdrc.json; then
  echo "Deployment to S3 failed"
  exit 1
else
  echo "Successfully deployed to S3"
fi
