#!/bin/sh

# This script runs the aws cli command to deploy the app to s3

# Try this step and throw an error if it fails
echo "Deploying to S3"
aws s3 sync build/ s3://"${BUCKET}"/ --acl public-read --follow-symlinks --delete --exclude .env-cmdrc.json 
echo "Deployed to S3"
