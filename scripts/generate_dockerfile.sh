#!/bin/bash

##
# This script creates a Dockerfile appropriate for your system,
# allowing this system to be deployed as a docker container.
##

# ANSI Color Escape Codes
RED="\033[0;31m"
CYAN="\033[0;36m"
YELLOW="\033[1;33m"
GREEN="\033[0;32m"
NC="\033[0m" # No Color

cd $(dirname $0)/..

PLACEHOLDER="%%BASE_IMAGE%%"
PI_IMAGE="arm32v6/node:lts-alpine"
NORMAL_IMAGE="node:lts-alpine"

if ! [ "$1" == "pi" ] && ! [ "$1" == "" ]; then
  echo -e "${RED}Error! Invalid argument \"$1\"!${NC}";
  exit 1
fi

if [ -f "../Dockerfile" ]; then
  echo -e "${CYAN}../Dockerfile already exists, removing...${NC}"
  rm ../Dockerfile
fi

if [ "$1" == "pi" ]; then
  echo -e "${CYAN}Generating Dockerfile with base image suitable for Raspberry Pi...${NC}"
  sed -r "s!$PLACEHOLDER!$PI_IMAGE!g" ../templates/Dockerfile.template > ../Dockerfile
else
  echo -e "${CYAN}Generating Dockerfile with base image suitable for most platforms...${NC}"
  sed -r "s!$PLACEHOLDER!$NORMAL_IMAGE!g" ../templates/Dockerfile.template > ../Dockerfile
fi

if [ -f "../Dockerfile" ]; then
  echo -e "${GREEN}Done!${NC}"
else
  echo -e "${RED}ERROR! ../Dockerfile not found... something must've gone wrong :/${NC}"
fi
