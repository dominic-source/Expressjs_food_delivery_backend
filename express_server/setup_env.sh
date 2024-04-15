#!/bin/bash

# Specify the file to read
file=".env"

# Check if a file is provided as an argument
if [ -z "$file" ]; then
  echo "Error: Please provide a file name as an argument."
  exit 1
fi

# Loop through each line in the file
while IFS= read -r line; do
  # Execute the line as a command
  export $line
done < "$file"
