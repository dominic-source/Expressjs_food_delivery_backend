import os
import subprocess

def recursive_git_add_commit(directory, commit_message_prefix="updated testcase for "):
	"""
	Recursively checks a directory for files and adds them to Git, then commits them.

	Args:
	directory: The directory to search.
	commit_message_prefix: The prefix for the commit message.
	"""
	for root, _, files in os.walk(directory):
		for file in files:
			file_path = os.path.join(root, file)
			# Git add the file
			subprocess.run(["git", "add", file_path])

			# Create a commit message based on the file name
			commit_message = f"{commit_message_prefix} {file.split('.')[0]}"
			print(commit_message)
			# Commit the changes
			subprocess.run(["git", "commit", "-m", commit_message])

userInput = input("Enter the directory path: ")
recursive_git_add_commit(userInput)
