#!/bin/sh -eu

cat <<EOF
window.REACT_APP_PORT=${REACT_APP_PORT};
window.REACT_APP_BASE_URL="${REACT_APP_BASE_URL}";
EOF
