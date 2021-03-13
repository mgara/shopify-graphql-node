#!/usr/bin/env bash
if [ -z "$1" ]
then
    echo "Please provider a valid semver"
else

    ./node_modules/.bin/json -I -f package.json -e "this.version=\"$1\""
    git commit package.json -m "Release \"$1\""
    git tag "v$1"
    git push origin --tags 
    git push
    npm publish --access-public
fi
