cat <<EOF > .evergreen.yml
api_server_host: $EVERGREEN_API_SERVER_HOST
ui_server_host: $EVERGREEN_UI_SERVER_HOST
api_key: $EVERGREEN_API_KEY
user: $EVERGREEN_USER
EOF
