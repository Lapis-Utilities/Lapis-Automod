#!/bin/bash

set +v

[ ! -d "./authCache/" ] && mkdir -p authCache

[ ! -f package-lock.json ] && echo "Installing necessary files..." && npm i

node .