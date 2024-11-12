#!/usr/bin/env bash

# crash on any error in the process
set -euo pipefail

./bin/build.sh
./bin/run.sh