if $CI = true; then
    # Use evergreen expansion syntax to get the variables we need to send the email
    AUTHOR_EMAIL=${author_email}
    REACT_APP_DEPLOYS_EMAIL=${REACT_APP_DEPLOYS_EMAIL}
    TASK_NAME=${task_name}
else
    # Fetch the variables from the git config.
    AUTHOR_EMAIL=$(git config user.email)
    REACT_APP_DEPLOYS_EMAIL=$REACT_APP_DEPLOYS_EMAIL
    TASK_NAME=$(git rev-parse HEAD)
fi

if $REACT_APP_DEPLOYS_EMAIL = ''; then
    echo "REACT_APP_DEPLOYS_EMAIL is not set" 
    exit 1
fi
PREVIOUS_VERSION=$(git describe --tags  --abbrev=0  `git rev-list --tags --max-count=1 --skip=1`)
git log --no-merges $PREVIOUS_VERSION..HEAD --pretty="format:%s (%h)" > body.txt

case "$OSTYPE" in
  darwin*)  
    echo "OSX detected" 
    gsed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt
  ;; 
  linux*)
    echo "LINUX"
    sed -i ':a;N;$!ba;s/\n/<br \/>/g' body.txt  
  ;;
  *)        echo "unknown: $OSTYPE" ;;
esac

BODY_HTML=$(cat body.txt)
DATE=$(date +'%m/%d/%Y')
COMMAND="evergreen -c ~/.evergreen.yml notify email -f $AUTHOR_EMAIL -r $REACT_APP_DEPLOYS_EMAIL -s "
COMMAND+="'"
COMMAND+="$DATE"
COMMAND+=" Spruce Deploy $TASK_NAME"
COMMAND+="'"
COMMAND+=" -b"
COMMAND+=" '"
COMMAND+="$BODY_HTML"
COMMAND+="'"
echo $COMMAND
eval $COMMAND
rm body.txt
