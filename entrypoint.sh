#!/bin/bash

## Function that's run if proper-config.json doesn't have a build.source attribute.
# Prompt the user for which theme they want to use, and then add a .build attribute onto proper-config.json

add_build_source(){
  # Find all stylesheets. Likely candidates for the Gulp project root
  STYLESHEETS=()
  while IFS=  read -r -d $'\0'; do
      STYLESHEETS+=($(echo "$REPLY" | sed 's/\/source\///' | sed 's/\/style.css//'))
      # echo "$REPLY"
  done < <(find /source/themes \( -name node_modules -prune \) -o -name "style.css" -print0 )
  # find /source/themes \( -name node_modules -prune \) -o -name "style.css" | grep style.css

  # Give the user the option to add a custom path
  STYLESHEETS+=("Custom...")
  STYLESHEETS+=("Quit")

  PS3="Your choice: "

  select SOURCE_PATH in ${STYLESHEETS[@]}; do
    case $SOURCE_PATH in
      "Custom...")
         echo "Enter a custom path..."
         break
         ;;
      "Quit")
         exit
         ;;
      *)
        # Some other commands here for the 'else' case
        break
        ;;
    esac
  done

  node /js/AddSourceToBuild.js $SOURCE_PATH

  echo "Set $SOURCE_PATH as the build root."
}

# if [[ -z `find /source \( -name node_modules -prune \) -o -name "proper-config.json" | grep proper-config.json` ]]; then
if [ -f /source/proper-config.json ]; then
  # We found a config file. Check if it contains a .build attribute

  CONFIG_BUILD=$(node -pe 'JSON.parse(process.argv[1]).build' "$(cat /source/proper-config.json)")

  # If there's not a .build attribute (i.e. the file just has .themes and .plugins) or .build.source = "." (i.e the build attribute exists, but just from a template), then 
  if [ "undefined" == "$CONFIG_BUILD" ]; then
    # We don't have a value for .source. Append the .build property from the built-in config file to the existing one
    echo "Adding .build properties to existing proper-config.json..."

    node /js/AddBuildToConfig.js

  # We've now got the basic template. Ask the user what they want to use as their project root
  add_build_source

  elif [ "." == $(node -pe 'JSON.parse(process.argv[1]).build.source' "$(cat /source/proper-config.json)") ]; then
    # We have .build.source, but it's set to ".". That's not very helpful
    add_build_source
  fi
else
  # We didn't find a config file. Copy across the entire existing ont
  echo "No configuration file found. Copying proper-config.json template to ./proper-config.json"
  cp /build/proper-config.json /source

  add_build_source
fi

# Do a gulp.
gulp "$@"