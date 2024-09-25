#!/bin/bash

# This script is used to read from the .env variables and load the
# environmental for any service running in the shell background such as
# the mongodb docker file 
# any other service 
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



#write a script that creates a file from a series of arguments

