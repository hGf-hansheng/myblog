#!/bin/sh
set -e

# Change ownership of the content and data directories to nextjs user
# This fixes permission issues when volumes are mounted from the host
# Only chown if we are running as root
if [ "$(id -u)" = "0" ]; then
  if [ -d "/app/content" ]; then
    chown -R nextjs:nodejs /app/content
  fi

  if [ -d "/app/data" ]; then
    chown -R nextjs:nodejs /app/data
  fi
  
  # Switch to nextjs user and execute the command
  exec su-exec nextjs "$@"
else
  # Already non-root, just exec
  exec "$@"
fi
