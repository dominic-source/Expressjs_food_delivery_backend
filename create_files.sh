#!/bin/bash

if [ "$#" -eq 1 ]; then
  echo "Usage: $0 model [file1] [file2]..."
  exit 1
fi
model=$1
shift

# Initialize counter
counter=0

for filename in "$@"; do
  mkdir -p "test/test_${model}_resolver"
  filename="test/test_${model}_resolver/${filename}.test.js"
  touch $filename
  echo "created file $filename"

  ((counter++))
done

echo "Total number of files created: $counter"
