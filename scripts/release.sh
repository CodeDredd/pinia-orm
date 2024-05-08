#!/bin/bash

set -e

# Restore all git changes
git restore -s@ -SW  -- packages

# Build all once to ensure things are nice
pnpm build

# Release packages
for PKG in packages/* ; do
  pushd $PKG
  TAG="latest"
  echo "⚡ Publishing $PKG with tag $TAG"
  cp ../../LICENSE .
  pnpm publish --access public --no-git-checks --tag $TAG
  popd > /dev/null
done
