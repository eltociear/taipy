#!/bin/bash

# Set the repository (format: owner/repo)
REPO="Avaiga/taipy"

# Get the list of pre-releases
pre_releases=$(gh release list --repo "$REPO" --json tagName,isPrerelease --jq '.[] | select(.isPrerelease == true) | .tagName')

# If there are no pre-releases, exit
if [ -z "$pre_releases" ]; then
    echo "No pre-releases found."
    exit 0
fi

# Get the latest pre-release tag
latest_pre_release=$(echo "$pre_releases" | head -n 1)

# Prepare a list of releases to delete
to_delete=()

# Identify pre-releases to delete
for tag in $pre_releases; do
    if [[ "$tag" == *"$latest_pre_release"* ]]; then
      echo "Latest release found! Skipping"
    else
      to_delete+=("$tag")
    fi
done

# Delete the releases
for tag in "${to_delete[@]}"; do
    echo "Deleting pre-release with tag: $tag"
    gh release delete "$tag" --repo "$REPO" --yes ----cleanup-tag
done

echo "Kept all pre-releases matching version: $latest_pre_release"
