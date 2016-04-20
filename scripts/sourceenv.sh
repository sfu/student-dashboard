#!/bin/bash

IFS=$'\n'
ENVFILE=$1

if [ ! -f $ENVFILE ]; then
  echo "No file '$ENVFILE' exists"
  exit 1
fi

if [ ! $ENVFILE ]; then
  echo "No .env file specified"
  exit 1
fi

for line in $(cat $ENVFILE); do
  if [ $(echo $line | head -c 1) != '#' ]; then
    export $line
  fi
done

